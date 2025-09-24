//
// Types (and a single function) that are shared
// between both throttle and debounce.
//
export function getTimeout(v) {
    if (v == null)
        return null;
    if (typeof v == 'number') {
        if (v < 0)
            return null;
        return v;
    }
    return getTimeout(v());
}
//# sourceMappingURL=throttle-debounce-helpers.js.map