var SVG,
    HEIGHT = 600,
    WIDTH = 600,
    SCALE = 800;

document.addEventListener('DOMContentLoaded', function() {
    var svg = d3.select('body').append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT);

    SVG = svg.append('g');

    drawMap();
});

function drawMap() {
    d3.json('brazil.geojson', function(data) {
        var centroid = d3.geoCentroid(data);

        var projection = d3.geoMercator()
            .scale([SCALE])
            .translate([WIDTH / 2, HEIGHT / 2])
            .center(centroid);

        var path = d3.geoPath()
            .projection(projection);

        var bounds = path.bounds(data);

        var offset = [
                WIDTH - (bounds[0][0] + bounds[1][0]) / 2,
                HEIGHT - (bounds[0][1] + bounds[1][1]) / 2
            ];

        projection.translate(offset);

        SVG.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', '#444');
    });
}
