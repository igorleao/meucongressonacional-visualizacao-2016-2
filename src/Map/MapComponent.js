import * as d3 from 'd3'
import Gastos from '../DataHandler/Gastos'
import BrazilGeoJSON from '../DataHandler/BrazilGeoJSON'
import Util from '../Util/Util'
import Event, * as Events from '../Events/Events'

const REGION_TO_CODE = {
    'AC': 12,
    'AL': 27,
    'AM': 13,
    'AP': 16,
    'BA': 29,
    'CE': 23,
    'DF': 53,
    'ES': 32,
    'GO': 52,
    'MA': 21,
    'MG': 31,
    'MS': 50,
    'MT': 51,
    'PA': 15,
    'PB': 25,
    'PE': 26,
    'PI': 22,
    'PR': 41,
    'RJ': 33,
    'RN': 24,
    'RO': 11,
    'RR': 14,
    'RS': 43,
    'SC': 42,
    'SE': 28,
    'SP': 35,
    'TO': 17
};

const CODE_TO_REGION = {
    '12': 'AC',
    '27': 'AL',
    '13': 'AM',
    '16': 'AP',
    '29': 'BA',
    '23': 'CE',
    '53': 'DF',
    '32': 'ES',
    '52': 'GO',
    '21': 'MA',
    '31': 'MG',
    '50': 'MS',
    '51': 'MT',
    '15': 'PA',
    '25': 'PB',
    '26': 'PE',
    '22': 'PI',
    '41': 'PR',
    '33': 'RJ',
    '24': 'RN',
    '11': 'RO',
    '14': 'RR',
    '43': 'RS',
    '42': 'SC',
    '28': 'SE',
    '35': 'SP',
    '17': 'TO'
}

export default class MapComponent {
    constructor(container) {
        var self = this;
        self.WIDTH = 400;
        self.HEIGHT = 400;
        self.SCALE = 580;
        self.container = container;

        self.render = () => {
            d3.select(`${self.container} > svg`).remove();

            let svg = d3.select(self.container)
                .append('svg')
                .attr('id', 'map')
                .attr('width', self.WIDTH)
                .attr('height', self.HEIGHT);

            self.SVG = svg.append('g');

            self.drawMap();
        }

        self.drawMap = () => {
            let data = BrazilGeoJSON.getGeoJSON();
            var centroid = d3.geoCentroid(data);

            var projection = d3.geoMercator()
                .scale([self.SCALE])
                .translate([self.WIDTH / 2, self.HEIGHT / 2])
                .center(centroid);

            var path = d3.geoPath()
                .projection(projection);

            var bounds = path.bounds(data);

            var offset = [
                self.WIDTH + 30 - (bounds[0][0] + bounds[1][0]) / 2,
                self.HEIGHT - (bounds[0][1] + bounds[1][1]) / 2
            ];

            projection.translate(offset);

            self.SVG.selectAll('path')
                .data(data.features)
                .enter()
                .append('path')
                .attr('fill', '#FFF7F9')
                .attr('d', path)
                .attr('data-regionCode', d => d.properties.ADMINCODE)
                .call(self.paintRegions)
                .call(self.setupMapRegion);
        }

        self.paintRegions = (selection) => {
            new Promise(function(fulfill, reject) {
                const expensesByRegionVector = Gastos.crossfilter()
                    .dimension(d => d.estado)
                    .group()
                    .reduceSum(d => parseFloat(d.gastoValor))
                    .all();

                let counters = {};

                const politiciansByRegionVector = Gastos.crossfilter()
                    .dimension(d => d.estado)
                    .group()
                    .reduce((p, d) => {
                        if (!(d.politicoId in counters)) {
                            counters[d.politicoId] = true;
                            return p + 1;
                        }

                        return p;
                    }, (p, d) => p, d => 0)
                    .all();

                let politiciansByRegion = Util.fromArray(politiciansByRegionVector,
                        e => e.key,
                        e => e.value);

                expensesByRegionVector.sort((a, b) => {
                    const A = a.value / politiciansByRegion[a.key];
                    const B = b.value / politiciansByRegion[b.key];
                    return A - B;
                });

                const leastSpendingState = expensesByRegionVector[0].key;
                const mostSpendingSate = expensesByRegionVector[expensesByRegionVector.length - 1].key;

                const expensesByRegion = Util.fromArray(expensesByRegionVector,
                        e => e.key,
                        e => e.value);

                const start = expensesByRegion[leastSpendingState] / politiciansByRegion[leastSpendingState];
                const end = expensesByRegion[mostSpendingSate] / politiciansByRegion[mostSpendingSate];

                let colorScale = d3.scaleLinear()
                    .range(['#fff7bc', '#662506'])
                    .domain([start, end]);

                selection.attr('fill', function(d) {
                    const region = CODE_TO_REGION[d.properties.ADMINCODE];
                    const politicians = politiciansByRegion[region];
                    const expense = expensesByRegion[region];
                    return colorScale(expense / politicians);
                });
            });
        }

        self.filterRegionByCode = (regionCode) => {
            self.regionDimension = self.regionDimension || Gastos.crossfilter()     
                .dimension(d => d.estado);

            self.regionDimension.filter(regionCode);
        }

        self.setupMapRegion = (regions) => {
            regions.each(function(region) {
                let code = region.properties.ADMINCODE;
                let el = d3.select(this);

                el.on('click', _ => {
                    const selected = el.classed('map-region-selected');
                    const codeToSend = !selected ? CODE_TO_REGION[code] : null;

                    self.filterRegionByCode(codeToSend);
                    Event.trigger(Events.REGION_SELECTED, self, codeToSend);

                    self.SVG.select('path.map-region-selected')
                        .classed('map-region-selected', false);
                    el.classed('map-region-selected', !selected);
                });

                el.on('mouseover', _ => {
                    el.classed('map-region-hover', true);
                });

                el.on('mouseout', _ => {
                    el.classed('map-region-hover', false);
                });
            })
        }
    }
}
