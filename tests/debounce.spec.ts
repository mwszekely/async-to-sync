import { expect } from '@playwright/test';
import { debounce } from "../dist/util/debounce";
import { throttleDebounce } from "../dist/util/throttle-debounce";
import { test } from './util/incrementor';

const SingleAndCombined = [
    { name: 'debounce', func: debounce },
    { name: 'throttleDebounce', func: throttleDebounce }
];

SingleAndCombined.forEach(({ func, name }) => test(`${name}(func, null) calls func synchronously`, async ({ incrementor }) => {
    const { handlerOut: debounced } = func({ handlerIn: incrementor.setValue, debounceDuration: null });

    expect(incrementor.getValue()).toBe(0);
    debounced(1);
    expect(incrementor.getValue()).toBe(1);
    debounced(2);
    expect(incrementor.getValue()).toBe(2);
    debounced(3);
    expect(incrementor.getValue()).toBe(3);
}));

SingleAndCombined.forEach(({ func, name }) => test(`${name}(func, positiveInteger) calls func asynchronously`, async ({ incrementor }) => {
    const { handlerOut: debounced } = func({ handlerIn: incrementor.setValue, debounceDuration: 1000 });

    expect(incrementor.getValue()).toBe(0);
    debounced(1);
    expect(incrementor.getValue()).toBe(0);
    debounced(2);
    debounced(3);
    expect(incrementor.getValue()).toBe(0);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await expect.poll(incrementor.getValue).toBe(3);
    debounced(4);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await expect.poll(incrementor.getValue).toBe(4);
}));

SingleAndCombined.forEach(({ func, name }) => test(`${name}(func, positiveInteger).flush() calls func immediately`, async ({ incrementor }) => {

    const { handlerOut: debounced, flush } = func({ handlerIn: incrementor.setValue, debounceDuration: 1000 });

    expect(incrementor.getValue()).toBe(0);
    debounced(1);
    expect(incrementor.getValue()).toBe(0);
    flush();
    expect(incrementor.getValue()).toBe(1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await expect.poll(incrementor.getValue).toBe(1);
}));

SingleAndCombined.forEach(({ func, name }) => test(`${name}(func, positiveInteger).cancel() prevents func from being called`, async ({ incrementor }) => {
    const { handlerOut: debounced, cancel } = func({ handlerIn: incrementor.setValue, debounceDuration: 1000 });

    expect(incrementor.getValue()).toBe(0);
    debounced(1);
    expect(incrementor.getValue()).toBe(0);
    cancel();
    expect(incrementor.getValue()).toBe(0);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await expect.poll(incrementor.getValue).toBe(0);
}));