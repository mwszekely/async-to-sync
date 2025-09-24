# Async to Sync

A small JS/TS library that lets you take an `async` function and, with a lot of callbacks, turn it into a (somewhat) normal sync function.

Generally, the way this works is:

1. You provide an `asyncInput` function. It can be basically anything; i.e. it can take arguments, return values, throw, and could be asynchronous or synchronous.
2. We return a `syncOutput` function. It can take arguments, **but will never return values or throw**. It is effectively a proxy that schedules your async function to run when ready.
    1. When you call `syncOutput`, we'll wait for any previous calls to `asyncInput` to finish before calling it again.
    2. Additionally, any arguments you pass to `syncOutput` when you call it can be optionally captured at that moment to preserve or transform them, which is **particularly useful for event handlers**.
3. To get updates on the status of the called function, including what value it returns, whether or not it threw, etc., use the various callbacks, like `onReturnValue` (to retrieve what your `asyncInput` returned), or `onAsyncDebounce` (to show a spinner).

For the full list of callbacks available and their documentation, see `AsyncToSyncParameters`.

This library is unlicensed into the public domain.

## Basic usage

```ts
import { asyncToSync } from 'async-to-sync';

async function someAsyncFunction(arg: number) { 
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(arg);
}

const { syncOutput } = asyncToSync({ 
    asyncInput: someAsyncFunction,
    onReturnValue: /* ... */,
    onError: /* ... */,
});

syncOutput(1);  // Waits 1s, prints "1"
syncOutput(2);  // Effectively discarded by the next line
syncOutput(3);  // Waits a further 1s, prints "3"

```

## Library integration

While `asyncToSync` can be used standalone, is is very likely that you'll want to use it as part of a UI library, such as React. While you can always make your own, the following bindings are provided by default:

* [React](https://react.dev/) (`"async-to-sync/react"`)
* [Preact](https://preactjs.com/) (`"async-to-sync/preact"`)
* [Preact signals](https://preactjs.com/guide/v11/signals/):
  * Standalone (`"async-to-sync/signals"`)
  * In React (`"async-to-sync/signals-react"`)
  * In Preact (`"async-to-sync/signals-preact"`)
* [Solid JS](https://www.solidjs.com/) (`"async-to-sync/solid"`)

### Example

The various bindings all share virtually the same interface. For brevity's sake only React examples will be shown here, but they all nearly identical in use.

In general, these hook/signal varieties take fewer callbacks, instead turning the arguments passed to those callbacks into `useState` variables or signals that are returned by the hook.

For example:

```tsx
import { useAsyncToSync } from "async-to-sync/react"

function MyComponent(props) {
    // Note that, instead of taking an onPending argument,
    // this hook simply returns a pending value.
    // Same for a number of the other callbacks.
    const { 
        pending, 
        returnValue, 
        syncOutput 
    } = useAsyncToSync({ asyncInput: props.asyncHandler });

    return pending? <Spinner /> : returnValue;
}
```

#### Notes for React/Preact

Like `useState`, the returned `syncOutput` function is absolutely stable (i.e. does not change throughout the lifetime of the component, and can be used without passing it to any dependency arrays). Additionally, you do not need to call `useCallback` on any `asyncInput`, `capture`, or any of the remaining callback functions; `syncOutput` will be stable regardless. 

As a consequence, however, `syncOutput` **cannot be called during render**. It can only be called during event handlers, `useEffect`/`useLayoutEffect`, etc.

#### Notes for Solid

The main convenience offered by the "hook" variety is the aforementioned transformation of callbacks to signals, but otherwise the normal version can be used just as well.

## Order of operations

1. You call `syncOutput`.
    1. `capture` is called on the arguments passed to `syncOutput`, and the result saved for later.
2. The "sync debounce" process starts (generally only relevant if you provide a `debounce`/`throttle` timeout)
    1. `onSyncDebounce(true)` is called to let you know that the actual call to `asyncInput` is pending (but not because we're waiting for any previous calls).
    2. If `debounce`/`throttle` are provided, then we wait as appropriate.
    3. `onSyncDebounce(false)` is called.
3. If `asyncInput` was already called earlier, and it's still running, then we call `onAsyncDebounce(true)` and stop for now. Otherwise, we start the process of running it:
    1. We call `onHasError(null)`, and `onHasResult(null)`. These are useful to update visuals for the user, e.g. showing a spinner.
    2. Your `asyncInput` function is called with the arguments that `capture` returned.
        1. If your `asyncInput` function throws before even getting to return a promise, then `onError(exception)` and `onInvoked("throw")` are called. This is an uncommon case.
    3. `onInvoked` is called with `"async"` if a `Promise` was returned, or `"sync"` otherwise.
4. When your `asyncInput` function finishes, whether it was sync or async, then:
    1. `onResolve()`, `onHasResult(true)`, and `onReturnValue(value)` are called if the function returned normally
    2. `onReject()`, `onHasError(true)`, and `onError(error)` are called if the function threw
    3. `onFinally()` is called in either case
    5. `onAsyncDebounce(false)` is called
5. Finally, if you called `syncOutput` any time between step 2 and now, then:
    1. Go to step 2.
