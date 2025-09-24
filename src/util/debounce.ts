import { getTimeout } from "./throttle-debounce-helpers.js";

import type { NullableNumberOrFunctionThatReturnsANullableNumber, ThrottleDebounceParametersBase, ThrottleDebounceReturnTypeBase } from "./throttle-debounce-helpers.js";

export interface DebounceParameters<A extends unknown[]> extends ThrottleDebounceParametersBase<A> {
    debounceDuration: NullableNumberOrFunctionThatReturnsANullableNumber;
}


export interface DebounceReturnType<A extends unknown[]> extends ThrottleDebounceReturnTypeBase<A> { }

export function debounce<A extends unknown[]>({ debounceDuration: durationOrGetter, handlerIn: handler }: DebounceParameters<A>): DebounceReturnType<A> {


    let timeoutHandle: number | null = null;
    let queuedArgs: A | null = null;

    function onDebounceEnded() {
        if (queuedArgs != null) {
            handler?.(...queuedArgs!);
            queuedArgs = null;
        }
    }

    function debounced(...args: A) {
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
    }
}
