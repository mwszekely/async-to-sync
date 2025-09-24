import type { Signal } from "@preact/signals";
import type { AsyncToSyncParameters } from "./core.js";
import type { AsyncToSyncReactiveReturnType, ReactiveParameters } from "./util/types.js";
type Signalify<T> = {
    [K in keyof T]: Signal<T[K]>;
};
export interface UseAsyncToSyncSignalsParameters<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs> extends Omit<AsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>, ReactiveParameters> {
}
export interface UseAsyncToSyncSignalsReturnType<ReturnType> extends Signalify<AsyncToSyncReactiveReturnType<ReturnType>> {
}
export declare function useAsyncToSyncSignals<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs>({ asyncInput, capture, debounce, throttle, onFinally, onInvoke, onInvoked, onReject, onResolve }: UseAsyncToSyncSignalsParameters<ReturnType, AsyncArgs, SyncArgs>): UseAsyncToSyncSignalsReturnType<ReturnType>;
export {};
//# sourceMappingURL=signals-react.d.ts.map