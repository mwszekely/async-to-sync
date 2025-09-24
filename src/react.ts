import { useState } from "react";
import { asyncToSync } from "./core.js";
import { useEffectEvent } from "./util/use-effect-event-react.js";

import type { AsyncToSyncParameters, AsyncToSyncReturnType, CaptureFunctionType } from "./core.js";
import type { AsyncToSyncReactiveReturnType, ReactiveParameters } from "./util/types.js";
import type { FunctionType } from "./util/use-effect-event-react.js";


export interface UseAsyncToSyncParameters<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs> extends Omit<AsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>, ReactiveParameters> { }
export interface UseAsyncToSyncReturnType<ReturnType, SyncArgs extends any[]> extends AsyncToSyncReturnType<SyncArgs>, AsyncToSyncReactiveReturnType<ReturnType> { }

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
    asyncInput: asyncInputUnstable,
    capture: captureUnstable,
    onFinally: onFinallyUnstable,
    onInvoke: onInvokeUnstable,
    onInvoked: onInvokedUnstable,
    onReject: onRejectUnstable,
    onResolve: onResolveUnstable,
    debounce,
    throttle
}: UseAsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>): UseAsyncToSyncReturnType<ReturnType, SyncArgs> {

    const [pending, setPending] = useState<boolean | null>(false);
    const [syncDebounce, setSyncDebounce] = useState<boolean | null>(false);
    const [asyncDebounce, setAsyncDebounce] = useState(false);
    const [error, setError] = useState<unknown>(undefined);
    const [hasError, setHasError] = useState<boolean | null>(null);
    const [hasResult, setHasResult] = useState<boolean | null>(null);
    const [returnValue, setReturnValue] = useState<ReturnType | undefined>(undefined);

    const asyncInput = useEffectEvent(asyncInputUnstable ?? noop as unknown as FunctionType<AsyncArgs, ReturnType>);
    const capture = useEffectEvent(captureUnstable ?? (identity as unknown as CaptureFunctionType<AsyncArgs, SyncArgs>));
    const onInvoke = useEffectEvent(onInvokeUnstable ?? noop);
    const onInvoked = useEffectEvent(onInvokedUnstable ?? noop);
    const onReject = useEffectEvent(onRejectUnstable ?? noop);
    const onResolve = useEffectEvent(onResolveUnstable ?? noop);
    const onFinally = useEffectEvent(onFinallyUnstable ?? noop);

    // We call useState instead of useMemo for semantic reasons 
    // (it's not an expensive calculation, it's a cached value).
    const [asyncToSyncInfo] = useState<AsyncToSyncReturnType<SyncArgs>>(() => asyncToSync({
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

