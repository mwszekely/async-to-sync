export type ReactiveParameters = "onError" | "onAsyncDebounce" | "onHasError" | "onHasResult" | "onPending" | "onReturnValue" | "onSyncDebounce";
export interface AsyncToSyncReactiveReturnType<ReturnType> {
    /** True when the next invocation is waiting for a previous async invocation to finish */
    asyncDebounce: boolean | null;
    /** True when the next invocation is waiting for the debounce/throttling period to end */
    syncDebounce: boolean | null;
    /**
     * True the async handler is currently running. False otherwise.
     *
     * Best used in conjunction with `asyncDebounce` and `syncDebounce`.
     * If any of these three are `true`, generally speaking, some kind of spinner
     * should probably be shown.
     */
    pending: boolean | null;
    hasResult: boolean | null;
    /** If the most recent invocation has finished and returned a value, this will be that value. */
    returnValue: ReturnType | undefined;
    /** If an error is thrown, this will be set to whatever was thrown. */
    error: unknown | undefined;
    hasError: boolean | null;
}
//# sourceMappingURL=types.d.ts.map