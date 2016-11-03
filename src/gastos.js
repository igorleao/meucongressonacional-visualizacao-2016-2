import {csv} from 'd3'
import * as crossfilter from 'crossfilter'

class Gastos {
  constructor() {
      self.PATH = "../data/politicodw.csv";
      d3.csv(PATH, function(error, data) {
        self.DATA = crossfilter(data);
      });
  }
  filter() { }
  notify() { }
}

export let gastos = new Gastos();
