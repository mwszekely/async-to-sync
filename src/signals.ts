import { signal } from "@preact/signals";
import { asyncToSync } from "./core.js";

import type { Signal } from "@preact/signals";
import type { AsyncToSyncParameters } from "./core.js";
import type { AsyncToSyncReactiveReturnType, ReactiveParameters } from "./util/types.js";

export interface AsyncToSyncSignalsParameters<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs> extends Omit<AsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>, ReactiveParameters> { }

type Signalify<T> = { [K in keyof T]: Signal<T[K]> };

export interface AsyncToSyncSignalsReturnType<ReturnType> extends Signalify<AsyncToSyncReactiveReturnType<ReturnType>> { }

export function asyncToSyncSignals<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs>({
    asyncInput,
    capture,
    debounce,
    throttle,
    onFinally,
    onInvoke,
    onInvoked,
    onReject,
    onResolve
}: AsyncToSyncSignalsParameters<ReturnType, AsyncArgs, SyncArgs>): AsyncToSyncSignalsReturnType<ReturnType> {
    const pending = signal(false);
    const syncDebounce = signal<boolean | null>(false);
    const asyncDebounce = signal(false);
    const error = signal<unknown>(undefined);
    const hasError = signal<boolean | null>(null);
    const hasResult = signal<boolean | null>(null);
    const returnValue = signal<ReturnType | undefined>(undefined);

    const ret = asyncToSync<ReturnType, AsyncArgs, SyncArgs>({
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
    }
}
