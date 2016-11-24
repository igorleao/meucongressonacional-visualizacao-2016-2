import * as d3 from "d3"
import Gastos from '../DataHandler/Gastos'

export const StackedBarsField = {
    GENDER: 1,
    CATEGORY: 2
};

export default class StackedBarsComponent {
    constructor(container) {
        var self = this;
        self.container = container;
        self.dimension = { height: 300, width: 600 };
        self.margin = { top: 20, right: 20, bottom: 30, left: 40 };
        self.width = self.dimension.width - self.margin.left - self.margin.right,
        self.height = self.dimension.height - self.margin.top - self.margin.bottom,

        self.x = d3.scaleBand().rangeRound([0, self.width]).padding(0.1).align(0.1);
        self.y = d3.scaleLinear().rangeRound([self.height, 0]);
        self.z = d3.scaleOrdinal();

        $("#select-tipo").change(function(){
            self.render()
        });

        $("#select-skb-metrica").change(function(){
            self.render()
        });

        $("#select-skb-exhi").change(function(){
            self.render()
        });

        self.render = () =>  {
            let options = { mean: ($("#select-skb-metrica").val() == 1) ? true : false,
                            normalized: ($("#select-skb-exhi").val() == 1) ? false : true }

            let field = ($("#select-tipo").val() == 1) ? StackedBarsField.GENDER : StackedBarsField.CATEGORY;

            d3.select(`${self.container} > svg`).remove();

            let svg = d3.select(self.container)
                .append("svg")
                .attr("height", self.dimension.height)
                .attr("width", self.dimension.width);

            self.SVG = svg.append("g")
                .attr("transform", `translate(${self.margin.left}, ${self.margin.top})`);


            field === StackedBarsField.GENDER && self.renderGender(options);
            field === StackedBarsField.CATEGORY && self.renderCategory(options);
        }

        self.genericDraw = (element, father, selector, drawFunction, data) => {
            let selection = (data != null) ? father.selectAll(selector).data(data) : father;
            let insertion = selection.enter();
            insertion.append(element).call(drawFunction);
            selection.exit().remove();
            selection.call(drawFunction);
            return father.selectAll(selector);
        }

        self.appendBars = (data) => {
            let _barsGroup = (sel) => {
                sel.attr("class", "serie")
                    .attr("fill", (d) => self.z(d.key))
            }

            let _barsItself = (sel) => {
                sel.attr("x", (d) => self.x(d.data.mesAno))
                    .attr("y", (d) => self.y(d[1]))
                    .attr("height", (d) => self.y(d[0]) - self.y(d[1]))
                    .attr("width", self.x.bandwidth());
            }

            let barsGroup = self.genericDraw("g", self.SVG, ".serie", _barsGroup, data);
            let bars = self.genericDraw("rect", barsGroup, "rect", _barsItself, d => d);
        }

        self.appendAxis = () => {
            let _drawX = (sel) => {
                sel.attr("class", "axis--x")
                    .attr("transform", "translate(0," + self.height + ")")
                    .call(d3.axisBottom(self.x));
            }

            let _groupY = (sel) => {
                sel.attr("class", "axis--y")
                    .call(d3.axisLeft(self.y).ticks(10, "s"))
            }

            let _drawY = (sel) => {
                sel.attr("x", 2)
                    .attr("class", "y-content")
                    .attr("y", self.y(self.y.ticks(10).pop()))
                    .attr("dy", "0.35em")
                    .attr("text-anchor", "start")
                    .attr("fill", "#000")
                    .text("Despesas");
            }

            let axisX = self.genericDraw("g", self.SVG, ".axis--x", _drawX, [""]);
            let groupY = self.genericDraw("g", self.SVG, ".axis--y", _groupY, [""]);
            let drawY = self.genericDraw("text", groupY, ".y-content", _drawY, [""]);
        }

        self.appendLegend = (data) => {
            let legendSel = self.SVG.selectAll(".legend-group")
              .data(data.reverse())

            let legend = legendSel.enter().append("g")
                .attr("class", "legend-group")
                .attr("transform", function(d, i) { return `translate(0, ${i * 20} )`; })
                .style("font", "10px sans-serif");
            legend.append("rect")
                .attr("x", self.width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", self.z);
            legend.append("text")
                .attr("x", self.width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .text(function(d) { return d; });

            legend = legendSel.select("g")
                .attr("class", "legend-group")
                .attr("transform", function(d, i) { return `translate(0, ${i * 20} )`; })
                .style("font", "10px sans-serif");

            legend.select("rect")
                .attr("x", self.width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", self.z);
            legend.select("text")
                .attr("x", self.width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .text(function(d) { return d; });

            legendSel.select("g").exit().remove();
            legendSel.exit().remove();
        }

        self.renderGender = (options) => {
            self.z = d3.scaleOrdinal().range(["#FFBCD9", "#87CEFA"]);

            let mesAno = Gastos.crossfilter()
                .dimension((d) => d.mesAno);
            let spendingsByMonthYear = mesAno.group()
                .reduce((p, v) => { p[v.sexo] += parseFloat(v.gastoValor); return p; },
                        (p, v) => p,
                        () => { return { 'F': 0, 'M': 0 }; });

            let countByMonth = mesAno.group()
                .reduce((p, v) => { p[v.sexo] += 1; return p; },
                        (p, v) => p,
                        () => { return { 'F': 0, 'M': 0 }; });

            let currentYear = new Date().getFullYear();
            let keys = d3.keys(spendingsByMonthYear.top(1)[0].value);
            let flattenData = [];

            let i = 0;
            let allcounts = countByMonth.all();
            for (let v of spendingsByMonthYear.all()) {
                if (parseInt(v.key.substring(0, 4)) <= currentYear) {
                    let obj = {};
                    obj.mesAno = v.key;
                    for (let k of keys) {
                        obj[k] = v.value[k];
                        options.mean && (obj[k] /= allcounts[i].value[k]); //TODO: checar se a ordem eh a mesma!!!!
                    }
                    flattenData.push(obj)
                }
                i += 1;
            }

            let stack = d3.stack()
                .keys(keys)
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetExpand);

            self.x.domain(flattenData.map(d => d.mesAno));

            if (!options.normalized) {
                stack.offset(d3.stackOffsetNone);
                self.y.domain([0, d3.max(flattenData, d => d3.sum(keys, k => d[k]))]).nice();
            } else {
                self.y.domain([0, 1]);
            }
            self.z.domain(keys);

            self.appendBars(stack(flattenData));
            self.appendAxis();
            self.appendLegend(["Mulheres", "Homens"]);
        }

        self.renderCategory = (options) => {
            let common = ["COMBUSTÍVEIS E LUBRIFICANTES.", "EMISSÃO BILHETE AÉREO", "FORNECIMENTO DE ALIMENTAÇÃO DO PARLAMENTAR", "SERVIÇOS POSTAIS", "TELEFONIA"];

            self.z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

            let mesAno = Gastos.crossfilter()
                .dimension((d) => d.mesAno);

            let spendingsByMonthYear = mesAno.group()
                .reduce((p, v) => {
                            let tipo = v.gastoTipo;
                            if (common.includes(tipo)) {
                                p[v.gastoTipo] += parseFloat(v.gastoValor);
                            }
                            return p;
                        }
                        ,
                        (p, v) => p,
                        () => {
                            let obj = {}
                            for (let d of common) {
                                obj[d] = 0
                            }
                            return obj;
                        });

            let countSpending = mesAno.group()
                .reduce((p, v) => {
                            let tipo = v.gastoTipo;
                            if (common.includes(tipo)) {
                                p[v.gastoTipo] += 1;
                            }
                            return p;
                        }
                        ,
                        (p, v) => p,
                        () => {
                            let obj = {}
                            for (let d of common) {
                                obj[d] = 0
                            }
                            return obj;
                        });

            let allcounts = countSpending.all();
            let currentYear = new Date().getFullYear();
            let keys = common;
            let flattenData = [];
            let i = 0;
            for (let v of spendingsByMonthYear.all()) {
                if (parseInt(v.key.substring(0, 4)) <= currentYear) {
                    let obj = {};
                    obj.mesAno = v.key;
                    for (let k of keys) {
                        obj[k] = v.value[k];
                        options.mean && (obj[k] /= allcounts[i].value[k]); //TODO: checar se a ordem eh a mesma!!!!
                    }
                    flattenData.push(obj)
                }
                i += 1;
            }

            /* END: tratamento dos dados para o formato do stacked-bars */

            // TODO: modularizar, talvez transformar em funções aqui dentro da classe mesmo, os métodos abaixo:
            let stack = d3.stack()
                .keys(keys)
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetExpand);

            self.x.domain(flattenData.map(d => d.mesAno));
            if (!options.normalized) {
                stack.offset(d3.stackOffsetNone);
                self.y.domain([0, d3.max(flattenData, d => d3.sum(keys, k => d[k]))]).nice();
            }
            self.z.domain(keys);

            self.appendBars(stack(flattenData));
            self.appendAxis();
            self.appendLegend(common);
        }

        self.filterByRegion = (regionCode) => {
            self.regionDimension = self.regionDimension || Gastos.crossfilter()
                .dimension(d => d.estado);

            self.regionDimension.filter(regionCode)
            self.render();
        }
    }
}
