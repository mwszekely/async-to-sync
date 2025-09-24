import type { DebounceParameters } from "./debounce.js";
import type { ThrottleDebounceReturnTypeBase } from "./throttle-debounce-helpers.js";
import type { ThrottleParameters } from "./throttle.js";
export interface ThrottleDebounceParameters<A extends unknown[]> extends DebounceParameters<A>, ThrottleParameters<A> {
}
export interface ThrottleDebounceReturnType<A extends unknown[]> extends ThrottleDebounceReturnTypeBase<A> {
}
export declare function throttleDebounce<A extends unknown[]>({ debounceDuration, throttleDuration, handlerIn }: ThrottleDebounceParameters<A>): ThrottleDebounceReturnType<A>;
//# sourceMappingURL=throttle-debounce.d.ts.map