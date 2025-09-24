import type { AsyncToSyncParameters, AsyncToSyncReturnType } from "./core.js";
import type { AsyncToSyncReactiveReturnType, ReactiveParameters } from "./util/types.js";
export interface UseAsyncToSyncParameters<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs> extends Omit<AsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>, ReactiveParameters> {
}
export interface UseAsyncToSyncReturnType<ReturnType, SyncArgs extends any[]> extends AsyncToSyncReturnType<SyncArgs>, AsyncToSyncReactiveReturnType<ReturnType> {
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
export declare function useAsyncToSync<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs>({ asyncInput: asyncInputUnstable, capture: captureUnstable, onFinally: onFinallyUnstable, onInvoke: onInvokeUnstable, onInvoked: onInvokedUnstable, onReject: onRejectUnstable, onResolve: onResolveUnstable, debounce, throttle }: UseAsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>): UseAsyncToSyncReturnType<ReturnType, SyncArgs>;
//# sourceMappingURL=react.d.ts.map