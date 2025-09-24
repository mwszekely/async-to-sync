import { useState } from "preact/hooks";
import { asyncToSync } from "./core.js";
import { useEffectEvent } from "./util/use-effect-event-preact.js";
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
export function useAsyncToSync({ asyncInput: asyncInputUnstable, capture: captureUnstable, onFinally: onFinallyUnstable, onInvoke: onInvokeUnstable, onInvoked: onInvokedUnstable, onReject: onRejectUnstable, onResolve: onResolveUnstable, debounce, throttle }) {
    const [pending, setPending] = useState(false);
    const [syncDebounce, setSyncDebounce] = useState(false);
    const [asyncDebounce, setAsyncDebounce] = useState(false);
    const [error, setError] = useState(undefined);
    const [hasError, setHasError] = useState(null);
    const [hasResult, setHasResult] = useState(null);
    const [returnValue, setReturnValue] = useState(undefined);
    const asyncInput = useEffectEvent(asyncInputUnstable ?? noop);
    const capture = useEffectEvent(captureUnstable ?? identity);
    const onInvoke = useEffectEvent(onInvokeUnstable ?? noop);
    const onInvoked = useEffectEvent(onInvokedUnstable ?? noop);
    const onReject = useEffectEvent(onRejectUnstable ?? noop);
    const onResolve = useEffectEvent(onResolveUnstable ?? noop);
    const onFinally = useEffectEvent(onFinallyUnstable ?? noop);
    // We call useState instead of useMemo for semantic reasons 
    // (it's not an expensive calculation, it's a cached value).
    const [asyncToSyncInfo] = useState(() => asyncToSync({
        asyncInput,
        capture,
        onError: setError,
        onFinally,
        onInvoke,
        onInvoked,
        onReject,
        onResolve,
        onPending: setPending,
        onSyncDebounce: setSyncDebounce,
        onAsyncDebounce: setAsyncDebounce,
        onHasError: setHasError,
        onHasResult: setHasResult,
        onReturnValue: setReturnValue,
        debounce,
        throttle,
    }));
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
//# sourceMappingURL=preact.js.map