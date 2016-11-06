import Gastos from './DataHandler/Gastos'
import BrazilGeoJSON from './DataHandler/BrazilGeoJSON'
import StackedBarsComponent, * as StackedBars from './StackedBars/StackedBarsComponent'
import MapComponent from './Map/MapComponent'
import Event, * as Events from './Events/Events'

const MAP_CONTAINER = '#map-container';
const STACKED_CONTAINER = '#stackedbars-container';

{
    let expensesPromise = Gastos.loadData();
    let brazilMapPromise = BrazilGeoJSON.loadData();

    let map = new MapComponent(MAP_CONTAINER);
    let stackedBars = new StackedBarsComponent(STACKED_CONTAINER);

    Event.listenTo(Events.MAP_REGION_CLICK,
            map,
            stackedBars.filterByRegion);

    expensesPromise.then(function() {
        stackedBars.render(StackedBars.StackedBarsField.GENDER);
    });

    Promise.all([expensesPromise, brazilMapPromise]).then(function(values) {
        map.render();
    });
}
