import { parse } from 'papaparse'
import * as crossfilter from 'crossfilter'

const PATH = "../../data/politicodw.csv";

export class Gastos {
  static load() {
    return new Promise(function(fulfill, reject) {
      let options = {
        delimiter: ";",
        header: true,
        download: true,
        complete: fulfill,
        skipEmptyLines: true,
        dynamicTyping: true
      };

      parse(PATH, options);
    }).then(function(results) {
      return results.data;
    });
  }
}

