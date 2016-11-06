
export const MAP_REGION_CLICK = 'map_region_click';

let LISTENERS = {};

export default class Events {
    static triggerMapRegionClick(element, data) {
        console.log(element);
        console.log(LISTENERS[MAP_REGION_CLICK][element]);

        if (LISTENERS[MAP_REGION_CLICK] === undefined) return;
        if (LISTENERS[MAP_REGION_CLICK][element] === undefined) return;


        LISTENERS[MAP_REGION_CLICK][element].forEach(function(cb) {
            cb(data);
        });
    }

    static listenToMapRegionClick(element, callback) {
        console.log(element);

        if (LISTENERS[MAP_REGION_CLICK] === undefined) {
            LISTENERS[MAP_REGION_CLICK] = {};
        }

        if (LISTENERS[MAP_REGION_CLICK][element] === undefined) {
            LISTENERS[MAP_REGION_CLICK][element] = [];
        }

        LISTENERS[MAP_REGION_CLICK][element].push(callback);

        console.log(LISTENERS[MAP_REGION_CLICK][element]);
    }
}
