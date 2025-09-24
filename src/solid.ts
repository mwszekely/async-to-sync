import { createSignal } from "solid-js";
import { asyncToSync, } from "./core.js";

import type { Signal } from "solid-js";
import type { AsyncToSyncParameters, AsyncToSyncReturnType } from "./core.js";
import type { AsyncToSyncReactiveReturnType, ReactiveParameters } from "./util/types.js";


export interface UseAsyncToSyncParameters<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs> extends Omit<AsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>, ReactiveParameters> { }

type Signalify<T> = { [K in keyof T]: Signal<T[K]> };

export interface UseAsyncToSyncReturnType<ReturnType, SyncArgs extends any[]> extends AsyncToSyncReturnType<SyncArgs>, Signalify<AsyncToSyncReactiveReturnType<ReturnType>> { }

function noop() { }
function identity<T extends any[]>(...args: T) { return args; }

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

export function useAsyncToSync<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs>({
    asyncInput,
    capture,
    onFinally,
    onInvoke,
    onInvoked,
    onReject,
    onResolve,
    debounce,
    throttle
}: UseAsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>): UseAsyncToSyncReturnType<ReturnType, SyncArgs> {

    const pending = createSignal<boolean | null>(false);
    const syncDebounce = createSignal<boolean | null>(false);
    const asyncDebounce = createSignal<boolean | null>(false);
    const error = createSignal<unknown>(undefined);
    const hasError = createSignal<boolean | null>(null);
    const hasResult = createSignal<boolean | null>(null);
    const returnValue = createSignal<ReturnType | undefined>(undefined);

    // We call useState instead of useMemo for semantic reasons 
    // (it's not an expensive calculation, it's a cached value).
    const asyncToSyncInfo = asyncToSync<ReturnType, AsyncArgs, SyncArgs>({
        asyncInput,
        capture,
        onFinally,
        onInvoke,
        onInvoked,
        onReject,
        onResolve,
        onError: e => { error[1](() => e) },
        onPending: x => { pending[1](x) },
        onSyncDebounce: x => { syncDebounce[1](x) },
        onAsyncDebounce: x => { asyncDebounce[1](x) },
        onHasError: x => { hasError[1](x) },
        onHasResult: x => { hasResult[1](x) },
        onReturnValue: (x: ReturnType) => { returnValue[1](() => x) },
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

