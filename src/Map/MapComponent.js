import * as d3 from "d3";
import Gastos from '../DataHandler/Gastos'
import Util from '../Util/Util'
import Events from '../Events/Events'

const GEOJSON_PATH = '../../data/brazil.geojson';

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

let THIS = null;

export default class MapComponent {
    constructor(container) {
        self.container = container;
        self.WIDTH = 600;
        self.HEIGHT = 600;
        self.SCALE = 800;
        THIS = this;
    }

    render() {
        self.SVG = d3.select(self.container).append('svg')
            .attr('width', self.WIDTH)
            .attr('height', self.HEIGHT)
            .append('g');

        this.drawMap();
    }

    drawMap() {
        d3.json(GEOJSON_PATH, function(data) {
            var centroid = d3.geoCentroid(data);

            var projection = d3.geoMercator()
                .scale([self.SCALE])
                .translate([self.WIDTH / 2, self.HEIGHT / 2])
                .center(centroid);

            var path = d3.geoPath()
                .projection(projection);

            var bounds = path.bounds(data);

            var offset = [
                    self.WIDTH - (bounds[0][0] + bounds[1][0]) / 2,
                    self.HEIGHT - (bounds[0][1] + bounds[1][1]) / 2
                ];

            projection.translate(offset);

            SVG.selectAll('path')
                .data(data.features)
                .enter()
                .append('path')
                .attr('fill', '#FFF7F9')
                .attr('d', path)
                .attr('data-regionCode', d => d.properties.ADMINCODE)
                .call(THIS.paintRegions)
                .each(THIS.setupMapRegion);
        });
    }

    paintRegions(selection) {
        new Promise(function(fulfill, reject) {
            let expensesByRegion = Gastos.crossfilter()
                .dimension(d => d.estado)
                .group()
                .reduce((sum, d) => sum + d.gastoValor,
                        (sum, d) => sum,
                        () => 0)
                .all();

            expensesByRegion.sort((a, b) => a.value - b.value);
            fulfill(expensesByRegion);
        }).then(function(expensesByRegion) {
            let start = expensesByRegion[0].value;
            let end = expensesByRegion[expensesByRegion.length - 1].value;

            let colorScale = d3.scaleLinear()
                .range(["#FFF7F9", "#946922"])
                .domain([start, end]);

            expensesByRegion = Util.fromArray(expensesByRegion,
                    e => e.key,
                    e => e.value);

            selection.attr('fill', function(d) {
                let region = CODE_TO_REGION[d.properties.ADMINCODE];
                let expense = expensesByRegion[region];
                return colorScale(expense);
            });
        });
    }

    setupMapRegion(region) {
        let el = d3.select(this);

        el.on('click', _ => {
            let code = el.attr('data-regionCode');
            Events.triggerMapRegionClick(THIS, code);
        });

        el.on('mouseover', _ => {
            el.classed('map-region-hover', true);
        });

        el.on('mouseout', _ => {
            el.classed('map-region-hover', false);
        });
    }
}

