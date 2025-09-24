import { useSignal } from "@preact/signals";
import { useState } from "react";
import { asyncToSync } from "./core.js";

import type { Signal } from "@preact/signals";
import type { AsyncToSyncParameters } from "./core.js";
import type { AsyncToSyncReactiveReturnType, ReactiveParameters } from "./util/types.js";

type Signalify<T> = { [K in keyof T]: Signal<T[K]> };

export interface UseAsyncToSyncSignalsParameters<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs> extends Omit<AsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>, ReactiveParameters> { }
export interface UseAsyncToSyncSignalsReturnType<ReturnType> extends Signalify<AsyncToSyncReactiveReturnType<ReturnType>> { }

export function useAsyncToSyncSignals<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs>({
    asyncInput,
    capture,
    debounce,
    throttle,
    onFinally,
    onInvoke,
    onInvoked,
    onReject,
    onResolve
}: UseAsyncToSyncSignalsParameters<ReturnType, AsyncArgs, SyncArgs>): UseAsyncToSyncSignalsReturnType<ReturnType> {
    const pending = useSignal(false);
    const syncDebounce = useSignal<boolean | null>(false);
    const asyncDebounce = useSignal(false);
    const error = useSignal<unknown>(undefined);
    const hasError = useSignal<boolean | null>(null);
    const hasResult = useSignal<boolean | null>(null);
    const returnValue = useSignal<ReturnType | undefined>(undefined);

    const ret = useState(() => asyncToSync<ReturnType, AsyncArgs, SyncArgs>({
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
    }
}
