import { signal } from "@preact/signals";
import { asyncToSync } from "./core.js";
export function asyncToSyncSignals({ asyncInput, capture, debounce, throttle, onFinally, onInvoke, onInvoked, onReject, onResolve }) {
    const pending = signal(false);
    const syncDebounce = signal(false);
    const asyncDebounce = signal(false);
    const error = signal(undefined);
    const hasError = signal(null);
    const hasResult = signal(null);
    const returnValue = signal(undefined);
    const ret = asyncToSync({
        asyncInput,
        capture,
        debounce,
        throttle,
        onAsyncDebounce: v => { asyncDebounce.value = v; },
        onError: v => { error.value = v; },
        onHasError: v => { hasError.value = v; },
        onHasResult: v => { hasResult.value = v; },
        onPending: p => { pending.value = p; },
        onReturnValue: v => { returnValue.value = v; },
        onSyncDebounce: v => { syncDebounce.value = v; },
        onFinally,
        onInvoke,
        onInvoked,
        onReject,
        onResolve
    });
    return {
        pending,
        syncDebounce,
        asyncDebounce,
        error,
        hasError,
        hasResult,
        returnValue,
        ...ret
    };
}
//# sourceMappingURL=signals.js.map