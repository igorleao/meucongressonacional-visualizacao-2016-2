import Gastos from './DataHandler/Gastos'
import StackedBarsComponent from './StackedBars/StackedBarsComponent'
import MapComponent from './Map/MapComponent'
import Events from './Events/Events'

const MAP_CONTAINER = '#map-container';
const STACKED_CONTAINER = '#stackedbars-container';

{
    Gastos.loadData().then(function(data) {
        let map = new MapComponent(MAP_CONTAINER);
        map.render();

        let stackedBars = new StackedBarsComponent(STACKED_CONTAINER);
        stackedBars.render();

        Events.listenToEvent(Events.MAP_REGION_CLICK,
                map,
                stackedBars.filterByRegion);
    })
}
