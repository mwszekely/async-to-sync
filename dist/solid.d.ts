import type { Signal } from "solid-js";
import type { AsyncToSyncParameters, AsyncToSyncReturnType } from "./core.js";
import type { AsyncToSyncReactiveReturnType, ReactiveParameters } from "./util/types.js";
export interface UseAsyncToSyncParameters<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs> extends Omit<AsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>, ReactiveParameters> {
}
type Signalify<T> = {
    [K in keyof T]: Signal<T[K]>;
};
export interface UseAsyncToSyncReturnType<ReturnType, SyncArgs extends any[]> extends AsyncToSyncReturnType<SyncArgs>, Signalify<AsyncToSyncReactiveReturnType<ReturnType>> {
}
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
export declare function useAsyncToSync<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs>({ asyncInput, capture, onFinally, onInvoke, onInvoked, onReject, onResolve, debounce, throttle }: UseAsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>): UseAsyncToSyncReturnType<ReturnType, SyncArgs>;
export {};
//# sourceMappingURL=solid.d.ts.map