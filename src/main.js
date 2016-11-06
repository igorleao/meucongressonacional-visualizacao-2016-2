import Gastos from './DataHandler/Gastos'
import StackedBarsComponent from './StackedBars/StackedBarsComponent'
import MapComponent from './Map/MapComponent'
import Events from './Events/Events'

{
    Gastos.loadData().then(function(data) {
        let map = new MapComponent('#map-container');
        map.render();

        let stackedBars = new StackedBarsComponent('#stackedbars-container');
        stackedBars.render();

        Events.listenToMapRegionClick(map, stackedBars.filterByRegion);
    })
}
