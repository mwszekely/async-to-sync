import { expect } from '@playwright/test';
import { throttle } from "../dist/util/throttle";
import { throttleDebounce } from "../dist/util/throttle-debounce";
import { test } from './util/incrementor';

const SingleAndCombined = [
    { name: 'throttle', func: throttle },
    { name: 'throttleDebounce', func: throttleDebounce }
];

SingleAndCombined.forEach(({ func, name }) => test(`${name}(func, positiveInteger) works as expected`, async ({ incrementor }) => {

    const { handlerOut: throttled } = func({ handlerIn: incrementor.setValue, throttleDuration: 1000 });

    expect(incrementor.getValue()).toBe(0);
    throttled(1);
    expect(incrementor.getValue()).toBe(1);
    throttled(2);
    expect(incrementor.getValue()).toBe(1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await expect.poll(incrementor.getValue).toBe(2);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await expect.poll(incrementor.getValue).toBe(2);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await expect.poll(incrementor.getValue).toBe(2);
}));

SingleAndCombined.forEach(({ func, name }) => test(`${name}(func, null) works as expected`, async ({ incrementor }) => {
    const { handlerOut: throttled } = func({ handlerIn: incrementor.setValue, throttleDuration: null });

    expect(incrementor.getValue()).toBe(0);
    throttled(1);
    expect(incrementor.getValue()).toBe(1);
}));

