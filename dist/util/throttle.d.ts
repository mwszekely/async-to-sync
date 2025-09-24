import { type NullableNumberOrFunctionThatReturnsANullableNumber, type ThrottleDebounceParametersBase, type ThrottleDebounceReturnTypeBase } from "./throttle-debounce-helpers.js";
export interface ThrottleParameters<A extends unknown[]> extends ThrottleDebounceParametersBase<A> {
    throttleDuration: NullableNumberOrFunctionThatReturnsANullableNumber;
}
export interface ThrottleReturnType<A extends unknown[]> extends ThrottleDebounceReturnTypeBase<A> {
}
export declare function throttle<A extends unknown[]>({ handlerIn: handler, throttleDuration: durationOrGetter }: ThrottleParameters<A>): ThrottleReturnType<A>;
//# sourceMappingURL=throttle.d.ts.map