import { useCallback, useRef } from "preact/hooks";

export type FunctionType<Args extends unknown[], Ret> = (...args: Args) => Ret;

// TODO: Rename this? Because if the real useEffectEvent is ever released
// it technically has different semantics. Maybe. 
// I dunno, it's been like a decade at this point and it keeps changing.
// At any rate this isn't part of our public API, so it doesn't matter right now.
export function useEffectEvent<Args extends unknown[], Ret>(value: FunctionType<Args, Ret>): FunctionType<Args, Ret> {

    // Holds the actual function. Only set after rendering has finished.
    const ref = useRef<FunctionType<Args, Ret>>(undefined!);
    
    // This bit of heretical impurity is specifically for Preact compatibility.
    // Preact doesn't have useInsertionEvent OR useEffectEvent,
    // but polyfills useInsertionEvent with useLayoutEvent,
    // which might not run early enough for us.
    // But Preact also doesn't "multi-thread" its renders,
    // so we can cheat a little bit and assume that the value
    // used during render IS the value that will be available after it.
    ref.current = value;

    return useCallback<FunctionType<Args, Ret>>((...args) => {
        // In Preact, without useInsertionEffect, we have no way
        // of testing against mid-render calls to the handler,
        // so we've just gotta blindly trust it.
        return ref.current(...args);
    }, []);
}
