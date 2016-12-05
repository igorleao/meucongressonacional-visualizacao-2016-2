import Gastos from './DataHandler/Gastos'
import BrazilGeoJSON from './DataHandler/BrazilGeoJSON'
import StackedBarsComponent, * as StackedBars from './StackedBars/StackedBarsComponent'
import MapComponent from './Map/MapComponent'
import TreemapComponent from './Treemap/TreemapComponent'
import Event, * as Events from './Events/Events'

import ProgressBar from "progressbar.js"

const MAP_CONTAINER = '#map-container';
const STACKED_CONTAINER = '#stackedbars-container';
const TREEMAP_CONTAINER = '#treemap-container'

{
    let bar1 = new ProgressBar.Circle(MAP_CONTAINER, { duration: 1800 });
    let bar2 = new ProgressBar.Circle(STACKED_CONTAINER, { duration: 1800 });
    let bar3 = new ProgressBar.Circle(TREEMAP_CONTAINER, { duration: 1800 });
    bar1.animate(1.0);
    bar2.animate(1.0);
    bar3.animate(1.0);

    let expensesPromise = Gastos.loadData();
    let brazilMapPromise = BrazilGeoJSON.loadData();

    let map = new MapComponent(MAP_CONTAINER);
    let stackedBars = new StackedBarsComponent(STACKED_CONTAINER);

    Event.listenTo(Events.MAP_REGION_CLICK,
            map,
            stackedBars.filterByRegion);

    Event.listenTo(Events.MAP_REGION_RESET,
            map,
            stackedBars.resetFilter);

    expensesPromise.then(function() {
        stackedBars.render();
        let treeMap = new TreemapComponent();

        Event.listenTo(Events.MAP_REGION_CLICK,
                map,
                treeMap.filterByRegion);

        Event.listenTo(Events.MAP_REGION_RESET,
                map,
                treeMap.resetFilter);
    });

    Promise.all([expensesPromise, brazilMapPromise]).then(function(values) {
        map.render();
    });
}
