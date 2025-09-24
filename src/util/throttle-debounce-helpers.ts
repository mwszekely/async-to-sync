//
// Types (and a single function) that are shared
// between both throttle and debounce.
//

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

export function getTimeout(v: NullableNumberOrFunctionThatReturnsANullableNumber): number | null {
    if (v == null)
        return null;
    if (typeof v == 'number') {
        if (v < 0)
            return null;
        return v;
    }
    return getTimeout(v());
}
