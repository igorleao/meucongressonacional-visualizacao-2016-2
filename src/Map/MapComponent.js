import * as d3 from "d3";
import Gastos from '../DataHandler/Gastos'

const GEOJSON_PATH = '../../data/brazil.geojson';

export default class MapComponent {
    constructor(container) {
        self.container = container;
        self.WIDTH = 600;
        self.HEIGHT = 600;
        self.SCALE = 800;
    }

    render() {
        self.SVG = d3.select(self.container).append('svg')
            .attr('width', self.WIDTH)
            .attr('height', self.HEIGHT)
            .append('g');

        this.drawMap();
    }

    drawMap() {
        let _this = this;

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
                .attr('d', path)
                .attr('fill', '#444')
                .attr('data-regionCode', d => d.properties.ADMINCODE)
                .each(_this.setupMapRegion);
        });
    }

    setupMapRegion(region) {
        var el = d3.select(this);

        el.on('click', _ => { console.log(el.attr('data-regionCode')) });
        el.on('mouseover', _ => { el.classed('on-mouse-over', true) });
        el.on('mouseout', _ => { el.classed('on-mouse-over', false) });
    }
}

