import * as d3 from "d3";

export class StackedBarsComponent {
    constructor(container, cf) {
        self.active = { gender: true, category: false };
        self.dimension = { height: 400, width: 600 };
        self.margin = { top: 20, right: 20, bottom: 30, left: 40 };
        self.width = self.dimension.width - self.margin.left - self.margin.right,
        self.height = self.dimension.height - self.margin.top - self.margin.bottom,

        self.x = d3.scaleBand().rangeRound([0, self.width]).padding(0.1).align(0.1);
        self.y = d3.scaleLinear().rangeRound([self.height, 0]);
        self.z = d3.scaleOrdinal().range(["#FFBCD9", "#87CEFA"]); //TODO: mudar para cores!!! -> Modularizar!!! -> preso no caso de genero!

        self.container = container;
        self.cf = cf;

        this.__init();
        this.render()
    }

    __init() {
        self.svg = d3.select(self.container)
        .append("svg")
        .attr("id", "stacked-svg")
        .attr("height", self.dimension.height)
        .attr("width", self.dimension.width);

        self.g = self.svg.append("g").attr("transform", `translate(${self.margin.left} , ${self.margin.top} )`);
    }

    __genericDraw(element, father, selector, drawFunction, data) {
        let selection = (data != null) ? father.selectAll(selector).data(data) : father;
        let insertion = selection.enter();
        insertion.append(element).call(drawFunction);
        selection.exit().remove();
        selection.call(drawFunction);
        return father.selectAll(selector);
    }

    __appendBars(data) {
        function _barsGroup(sel) {
            sel.attr("class", "serie")
            .attr("fill", (d) => self.z(d.key))
        }

        function _barsItself(sel) {
            sel.attr("x", (d) => self.x(d.data.mesAno))
            .attr("y", (d) => self.y(d[1]))
            .attr("height", (d) => self.y(d[0]) - self.y(d[1]))
            .attr("width", self.x.bandwidth());
        }

        let barsGroup = this.__genericDraw("g", self.g, ".serie", _barsGroup, data);
        let bars = this.__genericDraw("rect", barsGroup, "rect", _barsItself, function(d) { return d });
    }

    __appendAxis() {
        function _drawX(sel) {
            sel.attr("class", "axis--x")
            .attr("transform", "translate(0," + self.height + ")")
            .call(d3.axisBottom(self.x));
        }

        function _groupY(sel) {
            sel.attr("class", "axis--y")
            .call(d3.axisLeft(self.y).ticks(10, "s"))
        }

        function _drawY(sel) {
            sel.attr("x", 2)
            .attr("class", "y-content")
            .attr("y", self.y(self.y.ticks(10).pop()))
            .attr("dy", "0.35em")
            .attr("text-anchor", "start")
            .attr("fill", "#000")
            .text("Despesas");
        }

        let axisX = this.__genericDraw("g", self.g, ".axis--x", _drawX, [""]);
        let groupY = this.__genericDraw("g", self.g, ".axis--y", _groupY, [""]);
        let drawY = this.__genericDraw("text", groupY, ".y-content", _drawY, [""]);
    }

    __appendLegend(data) {
        function _legendGroup(sel) {
            sel.attr("class", "legend-group")
            .attr("transform", function(d, i) { return `translate(0, ${i * 20} )`; })
            .style("font", "10px sans-serif");
        }

        function _drawLegendRect(sel) {
            sel.attr("x", self.width - 18)
            .attr("class", "legend-rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", self.z);
        }

        function _drawLegendText(sel) {
            sel.attr("x", self.width - 24)
            .attr("class", "legend-text")
            .attr("y", 9)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .text((d) => d);
        }

        let groupLegend = this.__genericDraw("g", self.g, "legend-group", _legendGroup, data);
        let legendG1 = this.__genericDraw("rect", groupLegend, "legend-rect", _drawLegendRect, [""]); //TODO: NÃO FUNCIONANDO CORRETAMENTE!!!
        let legendG2 = this.__genericDraw("text", groupLegend, "legend-text", _drawLegendText, [""]); //TODO: NÃO FUNCIONANDO CORRETAMENTE!!!
    }

    __renderGender() {
        let mesAno = cf.dimension((d) => d.mesAno);
        let spendingsByMonthYear = mesAno.group().reduce(
            function(p, v) {
                if (v.sexo.toUpperCase() === "F") {
                    p.f += v.gastoValor;
                } else if (v.sexo.toUpperCase() === "M") {
                    p.m += v.gastoValor;
                }
                return p;
        },
            function(p, v) {
                return p;
        },
            function(p, v) {
                return {
                    f: 0,
                    m: 0
                }
        });

        /* BEGIN: tratamento dos dados para o formato do stacked-bars */
        let currentYear = new Date().getFullYear();
        let keys = d3.keys(spendingsByMonthYear.all()[0].value);
        let flattenData = [];

        for (let v of spendingsByMonthYear.all()) {
            if (parseInt(v.key.substring(0, 4)) <= currentYear) {
                let obj = {};
                obj.mesAno = v.key;
                for (let k of keys) {
                    obj[k] = v.value[k];
                }
                flattenData.push(obj)
            }
        }
        /* END: tratamento dos dados para o formato do stacked-bars */

        // TODO: modularizar, talvez transformar em funções aqui dentro da classe mesmo, os métodos abaixo:
        let stack = d3.stack()
          .keys(keys)
          .order(d3.stackOrderNone)
          .offset(d3.stackOffsetNone);

        x.domain(flattenData.map(function(d) { return d.mesAno; }));
        y.domain([0, d3.max(flattenData, function(d) {
            let sum = 0;
            for (let k of keys) {
                sum += d[k];
            }
            return sum;
        })]).nice();
        z.domain(keys);


        this.__appendBars(stack(flattenData));
        this.__appendAxis();
        this.__appendLegend(["Mulheres", "Homens"]);
    }

    render() {
        if (self.active.gender) this.__renderGender();
    }
}
