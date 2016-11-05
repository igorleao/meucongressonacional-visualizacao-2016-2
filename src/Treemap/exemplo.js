var canvas = d3.select("body").append("svg")
	.attr("width", 500)
	.attr("height", 500);

var stratify = d3.stratify()
    .parentId(function(d) { return d.name; });

var treemap = d3.treemap()
		.size([500, 500])
		.padding(1)
		.round(true);

d3.json("mydata.json", function(data) {
	//treemap.size([500, 500]).nodes(data);
	console.log(treemap);
	console.log(data);
});