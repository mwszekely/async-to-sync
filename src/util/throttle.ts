import {
    getTimeout,
    type NullableNumberOrFunctionThatReturnsANullableNumber,
    type ThrottleDebounceParametersBase,
    type ThrottleDebounceReturnTypeBase
} from "./throttle-debounce-helpers.js";

export interface ThrottleParameters<A extends unknown[]> extends ThrottleDebounceParametersBase<A> {
    throttleDuration: NullableNumberOrFunctionThatReturnsANullableNumber;
}

export interface ThrottleReturnType<A extends unknown[]> extends ThrottleDebounceReturnTypeBase<A> {}

export function throttle<A extends unknown[]>({ handlerIn: handler, throttleDuration: durationOrGetter }: ThrottleParameters<A>): ThrottleReturnType<A> {

    let timeoutHandle: number | null = null;

    // We have called `handler` during the throttle period.
    //let queuedUp = false;
    let queuedArgs: A | null = null;

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
                timeoutHandle = setTimeout(() => { timeoutHandle = null; runIfQueued(); }, throttleTimeout)
            }
        }
    }

    function throttled(...args: A) {
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
    }
}
