import type { NullableNumberOrFunctionThatReturnsANullableNumber, ThrottleDebounceParametersBase, ThrottleDebounceReturnTypeBase } from "./throttle-debounce-helpers.js";
export interface DebounceParameters<A extends unknown[]> extends ThrottleDebounceParametersBase<A> {
    debounceDuration: NullableNumberOrFunctionThatReturnsANullableNumber;
}
export interface DebounceReturnType<A extends unknown[]> extends ThrottleDebounceReturnTypeBase<A> {
}
export declare function debounce<A extends unknown[]>({ debounceDuration: durationOrGetter, handlerIn: handler }: DebounceParameters<A>): DebounceReturnType<A>;
//# sourceMappingURL=debounce.d.ts.map