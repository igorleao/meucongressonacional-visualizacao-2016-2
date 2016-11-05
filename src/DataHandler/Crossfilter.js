import * as crossfilter from 'crossfilter'

class Crossfilter {
    self.cf = crossfilter.default();

    add(data) {
        self.cf.add(data);
    }
}

export let Crossfilter = new Crossfilter();
