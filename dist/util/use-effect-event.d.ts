export type FunctionType<Args extends unknown[], Ret> = (...args: Args) => Ret;
export declare function useEffectEvent<Args extends unknown[], Ret>(value: FunctionType<Args, Ret>): FunctionType<Args, Ret>;
//# sourceMappingURL=use-effect-event.d.ts.map