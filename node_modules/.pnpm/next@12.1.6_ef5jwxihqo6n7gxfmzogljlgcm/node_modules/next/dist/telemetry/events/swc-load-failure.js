"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.eventSwcLoadFailure = eventSwcLoadFailure;
var _shared = require("../../trace/shared");
const EVENT_PLUGIN_PRESENT = 'NEXT_SWC_LOAD_FAILURE';
async function eventSwcLoadFailure(event) {
    const telemetry = _shared.traceGlobals.get('telemetry');
    // can't continue if telemetry isn't set
    if (!telemetry) return;
    telemetry.record({
        eventName: EVENT_PLUGIN_PRESENT,
        payload: event
    });
    // ensure this event is flushed before process exits
    await telemetry.flush();
}

//# sourceMappingURL=swc-load-failure.js.map