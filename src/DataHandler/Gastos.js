import { parse } from 'papaparse'

export class Gastos {
  constructor(callback) {
      self.ready = false;
      self.PATH = "../../data/politicodw.csv";

      console.log("NAO TRAVOU!");
      console.log("LENDO JSON");
      let data = parse(self.PATH, {
          delimiter: ";",
          header: true,
          download: true,
          complete: callback,
          skipEmptyLines: true,
          dynamicTyping: true
        }
      );
  }
}
