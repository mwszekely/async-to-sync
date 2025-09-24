import { useSignal } from "@preact/signals";
import { useState } from "preact/hooks";
import { asyncToSync } from "./core.js";
export function useAsyncToSyncSignals({ asyncInput, capture, debounce, throttle, onFinally, onInvoke, onInvoked, onReject, onResolve }) {
    const pending = useSignal(false);
    const syncDebounce = useSignal(false);
    const asyncDebounce = useSignal(false);
    const error = useSignal(undefined);
    const hasError = useSignal(null);
    const hasResult = useSignal(null);
    const returnValue = useSignal(undefined);
    const ret = useState(() => asyncToSync({
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
    }));
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
//# sourceMappingURL=signals-preact.js.map