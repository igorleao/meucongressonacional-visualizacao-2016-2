import Gastos from './DataHandler/Gastos.js'
import { StackedBarsComponent } from "./StackedBars/StackedBarsComponent.js"

{
    Gastos.loadData().then(function(data) {
        let stakedBars = new StackedBarsComponent("#stackedbars-container");
    })
}
