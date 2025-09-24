import { createSignal } from "solid-js";
import { asyncToSync, } from "./core.js";
function noop() { }
function identity(...args) { return args; }
/**
 * `asyncToSync`, but as a React hook.
 *
 * Please note the following:
 *
 * * Most callbacks are replaced with return values. For example, `onReturnValue`
 *   is replaced with `returnValue` as something that's returned by this hook.
 * * **Calling `syncOutput` during render is not allowed**.
 *   `syncOutput` can only be called during events/effects.
 */
export function useAsyncToSync({ asyncInput, capture, onFinally, onInvoke, onInvoked, onReject, onResolve, debounce, throttle }) {
    const pending = createSignal(false);
    const syncDebounce = createSignal(false);
    const asyncDebounce = createSignal(false);
    const error = createSignal(undefined);
    const hasError = createSignal(null);
    const hasResult = createSignal(null);
    const returnValue = createSignal(undefined);
    // We call useState instead of useMemo for semantic reasons 
    // (it's not an expensive calculation, it's a cached value).
    const asyncToSyncInfo = asyncToSync({
        asyncInput,
        capture,
        onFinally,
        onInvoke,
        onInvoked,
        onReject,
        onResolve,
        onError: e => { error[1](() => e); },
        onPending: x => { pending[1](x); },
        onSyncDebounce: x => { syncDebounce[1](x); },
        onAsyncDebounce: x => { asyncDebounce[1](x); },
        onHasError: x => { hasError[1](x); },
        onHasResult: x => { hasResult[1](x); },
        onReturnValue: (x) => { returnValue[1](() => x); },
        debounce,
        throttle,
    });
    return {
        syncDebounce,
        asyncDebounce,
        error,
        hasResult,
        hasError,
        pending,
        returnValue,
        ...asyncToSyncInfo
    };
}
//# sourceMappingURL=solid.js.map