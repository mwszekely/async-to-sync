import { debounce } from "./debounce.js";
import { throttle } from "./throttle.js";

import type { DebounceParameters } from "./debounce.js";
import type { ThrottleDebounceReturnTypeBase } from "./throttle-debounce-helpers.js";
import type { ThrottleParameters } from "./throttle.js";

export interface ThrottleDebounceParameters<A extends unknown[]> extends DebounceParameters<A>, ThrottleParameters<A> { }
export interface ThrottleDebounceReturnType<A extends unknown[]> extends ThrottleDebounceReturnTypeBase<A> { }

export function throttleDebounce<A extends unknown[]>({ debounceDuration, throttleDuration, handlerIn }: ThrottleDebounceParameters<A>): ThrottleDebounceReturnType<A> {
    const t = throttle<A>({ handlerIn, throttleDuration });
    const d = debounce<A>({ handlerIn: t.handlerOut, debounceDuration });
    return {
        handlerOut: d.handlerOut,
        cancel: () => { t.cancel(); d.cancel(); },
        flush: () => { d.flush(); }
    }
}
