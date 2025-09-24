import { getTimeout } from "./throttle-debounce-helpers.js";
export function debounce({ debounceDuration: durationOrGetter, handlerIn: handler }) {
    let timeoutHandle = null;
    let queuedArgs = null;
    function onDebounceEnded() {
        if (queuedArgs != null) {
            handler?.(...queuedArgs);
            queuedArgs = null;
        }
    }
    function debounced(...args) {
        queuedArgs = args;
        const debounceTimeout = getTimeout(durationOrGetter);
        if (debounceTimeout == null)
            handler?.(...queuedArgs);
        else {
            if (timeoutHandle != null)
                cancel();
            timeoutHandle = setTimeout(onDebounceEnded, debounceTimeout);
        }
    }
    function flush() {
        if (timeoutHandle != null) {
            onDebounceEnded();
            cancel();
        }
    }
    function cancel() {
        if (timeoutHandle != null)
            clearTimeout(timeoutHandle);
    }
    return {
        handlerOut: debounced,
        flush,
        cancel
    };
}
//# sourceMappingURL=debounce.js.map