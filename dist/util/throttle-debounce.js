import { debounce } from "./debounce.js";
import { throttle } from "./throttle.js";
export function throttleDebounce({ debounceDuration, throttleDuration, handlerIn }) {
    const t = throttle({ handlerIn, throttleDuration });
    const d = debounce({ handlerIn: t.handlerOut, debounceDuration });
    return {
        handlerOut: d.handlerOut,
        cancel: () => { t.cancel(); d.cancel(); },
        flush: () => { d.flush(); }
    };
}
//# sourceMappingURL=throttle-debounce.js.map