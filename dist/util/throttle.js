import { getTimeout } from "./throttle-debounce-helpers.js";
export function throttle({ handlerIn: handler, throttleDuration: durationOrGetter }) {
    let timeoutHandle = null;
    // We have called `handler` during the throttle period.
    //let queuedUp = false;
    let queuedArgs = null;
    function runIfQueued() {
        if (queuedArgs != null) {
            const throttleTimeout = getTimeout(durationOrGetter);
            if (throttleTimeout == null) {
                handler?.(...queuedArgs);
            }
            else {
                if (timeoutHandle == null) {
                    handler?.(...queuedArgs);
                    queuedArgs = null;
                }
                timeoutHandle = setTimeout(() => { timeoutHandle = null; runIfQueued(); }, throttleTimeout);
            }
        }
    }
    function throttled(...args) {
        queuedArgs = args;
        runIfQueued();
    }
    function cancel() {
        if (timeoutHandle != null) {
            clearTimeout(timeoutHandle);
            timeoutHandle = null;
        }
    }
    function flush() {
        runIfQueued();
        cancel();
    }
    return {
        handlerOut: throttled,
        cancel,
        flush
    };
}
//# sourceMappingURL=throttle.js.map