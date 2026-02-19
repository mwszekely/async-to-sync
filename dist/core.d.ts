import type { NullableNumberOrFunctionThatReturnsANullableNumber } from "./util/throttle-debounce-helpers.js";
export type CaptureFunctionType<AP extends unknown[], SP extends unknown[] = AP> = (...args: SP) => AP;
export interface AsyncToSyncParameters<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs> {
    /**
     * The function to create a sync version of.
     *
     * While you almost always do want to specify a value here,
     * null is allowed, in which case a `syncOutput` function will still
     * be returned. If called, it simply returns immediately, and will
     * not invoke any of the callbacks or run any additional logic.
     */
    asyncInput: ((...args: AsyncArgs) => (ReturnType | Promise<ReturnType>)) | null | undefined;
    /**
     * When the function starts running, this is set to true.
     * When it stops running, this is set to false.
     *
     * This is the same for sync and async functions. When
     * a sync function is used, onPending will be called twice on the same frame.
     */
    onPending?: ((pending: boolean) => void) | null | undefined;
    /**
     * When the *sync handler is invoked* (even if the async handler doesn't run yet), this is set to `true`.
     *
     * When the debounce period, as specified by either `wait` or `throttle`, has ended, this is set to `false`.
     *
     * This is the same even when not using `wait` or `throttle`. In this case, `onSyncDebounce` will be called twice on the same frame.
     */
    onSyncDebounce?: ((debouncing: boolean) => void) | null | undefined;
    /**
     * When the async handler is about to start running (after debouncing and throttling have finished),
     * but must wait for another in-process handler to finish, this is set to `true`.
     *
     * When the handler finishes (regardless of if it was sync or async), this is set to `false`.
     */
    onAsyncDebounce?: ((debouncing: boolean) => void) | null | undefined;
    /**
     * When the handler returns, its return value will be passed to this function (after awaiting it if necessary).
     *
     * Even if the handler does not return anything, this will still be called (with `undefined`)
     *
     * This value is not reset at any time! See `onHasResult` to determine if there is a value at any given time.
     * @param ret
     */
    onReturnValue?: ((ret: ReturnType) => void) | null | undefined;
    /**
     * When the handler `throw`s, the value thrown will be passed to this function.
     *
     * This value is not reset at any time! See `onHasError` to determine if there is a value at any given time.
     *
     * @param ex
     */
    onError?: ((ex: unknown) => void) | null | undefined;
    /**
     * Immediately before the handler will be called
     * (after all methods of debouncing and throttling and such)
     * this is always called once.
     *
     * @see onInvoked (called immediately after instead)
     */
    onInvoke?: (() => void) | null | undefined;
    /**
     * Immediately after the handler has been called, this is called once with the result of the call.
     *
     * This can be used to estimate if a given handler was sync or async, though if it throws you might not know.
     *
     * @see onInvoke (called immediately before instead)
     */
    onInvoked?: ((result: "async" | "throw" | "sync") => void) | null | undefined;
    /**
     * When the handler returns successfully, this will be called once.
     *
     * @see onFinally
     * @see onReject
     */
    onResolve?: (() => void) | null | undefined;
    /**
     * When the handler rejects, for any reason, this will be called once.
     *
     * @see onResolve
     * @see onFinally
     */
    onReject?: (() => void) | null | undefined;
    /**
     * When the handler resolves, for any reason, this will be called once.
     * @see onResolve
     * @see onReject
     */
    onFinally?: (() => void) | null | undefined;
    /**
     * It's frequently necessary (especially with DOM events) to save
     * values so that they don't become stale.  For example, referencing
     * `event.currentTarget.value` is a *live* value, so your handler
     * could be called with, seemingly, different arguments than were initially passed.
     *
     * To prevent this "stale argument" problem, you can capture the useful parts
     * of whatever the async function's arguments are into an object that's not live.
     *
     * For example, `e => ([e, e.currentTarget.value])`
     *
     * Remember that even if your async function only takes a single argument,
     * the return value of `capture` **must be an array**
     * (specifically the array of arguments passed to your async function).
     */
    capture?: CaptureFunctionType<AsyncArgs, SyncArgs> | null | undefined;
    /**
     * Similar to Lodash's `throttle` function.
     *
     * If a positive integer, applies *before* waiting for any prior async handlers to finish.
     */
    throttle?: NullableNumberOrFunctionThatReturnsANullableNumber;
    /**
     * Similar to Lodash's `debounce` function.
     *
     * If a positive integer, it applies *before* waiting for any prior async handlers to finish.
     */
    debounce?: NullableNumberOrFunctionThatReturnsANullableNumber;
    /**
     * When the handler is about to run, this is called with `null`.
     *
     * If the handler throws, then this will be called with `true`, and whatever was thrown will be passed as the second argument.
     * If it resolves, this will be called with `false`.
     *
     * This is the same for sync and async functions;
     * sync functions will result in this function being called twice in one frame.
     */
    onHasError?: ((hasError: boolean | null, error?: unknown) => void) | null | undefined;
    /**
     * When the handler is about to run, this is called with `null`.
     *
     * If the handler resolves successfully, then this will be called with `true`,
     * and whatever was returned will be passed as the second argument.
     * If it throws, this will be called with `false`.
     *
     * This is the same for sync and async functions;
     * sync functions will result in this function being called twice in one frame.
     */
    onHasResult?: ((hasResult: boolean | null, result?: ReturnType) => void) | null | undefined;
}
export interface AsyncToSyncReturnType<SyncArgs extends any[]> {
    /**
     * The sync version of the handler you specified.
     *
     * It doesn't return a value (because it can't in case the handler was async).
     */
    syncOutput: (...args: SyncArgs) => void;
    /**
     * If there are currently any handlers in wait because they are throttled or debounced
     * (not from being async, but from the `throttle` or `debounce` settings),
     * this will force its immediate invocation (as soon as the given async handler has
     * finished, if any
     */
    flushSyncDebounce(): void;
    /**
     * If there are currently any handlers in wait because they are throttled or debounced
     * (not from being async, but from the `throttle` or `debounce` settings),
     * this will cancel its future invocation, causing it to no longer run.
     */
    cancelSyncDebounce(): void;
}
/**
 * lodash-ish function that's like debounce + (throttle w/ async handling) combined.
 *
 * Requires a lot of callbacks to meaningfully turn a red function into a blue one, but you *can* do it!
 * Note that part of this is emulating the fact that the sync handler cannot have a return value,
 * so you'll need to use `setResolve` and the other related functions to do that in whatever way works for your specific scenario.
 *
 * @type `ReturnType` The type that your async function returns (may or may not be wrapped in a `Promise<>`)
 * @type `AsyncArgs` The arguments that your async function takes (as an array)
 * @type `SyncArgs` The arguments that the returned sync function takes (as an array). Defaults to the same type as `AsyncArgs`.
 */
export declare function asyncToSync<ReturnType, AsyncArgs extends any[], SyncArgs extends any[] = AsyncArgs>({ asyncInput, onInvoke, onInvoked, onFinally: onFinallyAny, onReject, onResolve, onHasError, onHasResult, onError, onReturnValue, capture, onAsyncDebounce, onSyncDebounce, onPending, throttle: throttleDuration, debounce: debounceDuration }: AsyncToSyncParameters<ReturnType, AsyncArgs, SyncArgs>): AsyncToSyncReturnType<SyncArgs>;
//# sourceMappingURL=core.d.ts.map