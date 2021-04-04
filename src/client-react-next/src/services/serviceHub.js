const events = {};

function registerEvent(name, action) {
    events[name] = action;
}

function runEvent(name) {
    if(events[name]) {
        events[name]();
    }
}

export { registerEvent, runEvent }