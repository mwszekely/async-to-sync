import { useCallback, useInsertionEffect, useRef } from "react";
// TODO: Rename this? Because if the real useEffectEvent is ever released
// it technically has different semantics. Maybe. 
// I dunno, it's been like a decade at this point and it keeps changing.
// At any rate this isn't part of our public API, so it doesn't matter right now.
export function useEffectEvent(value) {
    // This is false during render, true afterwards.
    const ready = useRef(false);
    ready.current = false;
    // Holds the actual function. Only set after rendering has finished.
    const ref = useRef(undefined);
    // This bit of heretical impurity is specifically for Preact compatibility.
    // Preact doesn't have useInsertionEvent OR useEffectEvent,
    // but polyfills useInsertionEvent with useLayoutEvent,
    // which might not run early enough for us.
    // But Preact also doesn't "multi-thread" its renders,
    // so we can cheat a little bit and assume that the value
    // used during render IS the value that will be available after it.
    ref.current = value;
    // AFTER render, but BEFORE any other effects run,
    // save the value that was actually used during render.
    useInsertionEffect((() => {
        ready.current = true;
        ref.current = value;
    }), [value]);
    return useCallback((...args) => {
        if (ready.current === false)
            throw new Error('Value retrieved from useEffectEvent() cannot be called during render (or useInsertionEffect).');
        return ref.current(...args);
    }, []);
}
//# sourceMappingURL=use-effect-event.js.map