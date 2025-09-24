export type NullableNumber = number | null | undefined;
export type NullableNumberOrFunctionThatReturnsANullableNumber = NullableNumber | (() => NullableNumberOrFunctionThatReturnsANullableNumber);
export interface ThrottleDebounceReturnTypeBase<A extends unknown[]> {
    flush(): void;
    cancel(): void;
    handlerOut: (...args: A) => void;
}
export interface ThrottleDebounceParametersBase<A extends unknown[]> {
    handlerIn?: ((...args: A) => void) | null | undefined;
}
export declare function getTimeout(v: NullableNumberOrFunctionThatReturnsANullableNumber): number | null;
//# sourceMappingURL=throttle-debounce-helpers.d.ts.map