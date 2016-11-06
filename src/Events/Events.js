
export const MAP_REGION_CLICK = 'map_region_click';

let LISTENERS = {};

export default class Events {
    static triggerEvent(event, element, data) {
        if (LISTENERS[event] === undefined) return;
        if (LISTENERS[event][element] === undefined) return;

        LISTENERS[event][element].forEach(cb => cb(data));
    }

    static listenToEvent(event, element, callback) {
        if (LISTENERS[event] === undefined) {
            LISTENERS[event] = {};
        }

        if (LISTENERS[event][element] === undefined) {
            LISTENERS[event][element] = [];
        }

        LISTENERS[event][element].push(callback);
    }
}
