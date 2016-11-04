import { parse } from 'papaparse'
import * as crossfilter from 'crossfilter'

class Gastos {
  constructor() {
      self.ready = false;
      self.PATH = "../data/politicodw.csv";
      self.cf = crossfilter.default()

      let data = parse(self.PATH, {
          delimiter: ";",
          header: true,
          download: true,
          complete: this.csvCallBack
        }
      );
  }
  csvCallBack(results, file) {
    self.ready = true;
    self.cf.add(results.data);
  }
  filter() { }
  notify() { }
}

export let gastos = new Gastos();
