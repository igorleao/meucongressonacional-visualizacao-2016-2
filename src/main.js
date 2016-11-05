import * as crossfilter from 'crossfilter'

import { Gastos } from './DataHandler/Gastos.js'
import { StackedBarsComponent } from "./StackedBars/StackedBarsComponent.js"

{
    let cf = crossfilter.default();
    let gastos = new Gastos(loadData);

    function loadData(results, file) {
        console.log(results);
        cf.add(results.data);
        let stakedBars = new StackedBarsComponent("#stackedbars-container", cf);
    }
}
