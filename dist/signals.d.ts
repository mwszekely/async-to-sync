import type { Signal } from "@preact/signals";
import type { AsyncToSyncParameters } from "./core.js";
import type { AsyncToSyncReactiveReturnType, ReactiveParameters } from "./util/types.js";
export interface AsyncToSyncSignalsParameters<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs> extends Omit<AsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>, ReactiveParameters> {
}
type Signalify<T> = {
    [K in keyof T]: Signal<T[K]>;
};
export interface AsyncToSyncSignalsReturnType<ReturnType> extends Signalify<AsyncToSyncReactiveReturnType<ReturnType>> {
}
export declare function asyncToSyncSignals<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs>({ asyncInput, capture, debounce, throttle, onFinally, onInvoke, onInvoked, onReject, onResolve }: AsyncToSyncSignalsParameters<ReturnType, AsyncArgs, SyncArgs>): AsyncToSyncSignalsReturnType<ReturnType>;
export {};
//# sourceMappingURL=signals.d.ts.map