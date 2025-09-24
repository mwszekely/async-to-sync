import { test as base } from '@playwright/test';

interface Incrementor {
    getValue(): number;
    //setAsyncWait(ms: number): void;
    increment(): void;
    setValue(value: number): void;
}

// Extend basic test by providing a "todoPage" fixture.
export const test = base.extend<{ incrementor: Incrementor }>({
    incrementor: async ({ page }, use) => {
        let timeoutDuration = 500;
        let value = 0;
        function increment() { value += 1; }
        function setValue(v: number) { value = v; }
        //async function incrementAsync() { await new Promise(resolve => setTimeout(resolve, timeoutDuration)); incrementSync(); }
        const incrementor: Incrementor = {
            increment,
            setValue,
            //setAsyncWait: v => { timeoutDuration = v; },
            getValue: () => value
        };
        await use(incrementor);
    },
});