import { expect } from '@playwright/test';
import { asyncToSync } from "../dist/core";
import { test } from './util/incrementor';

test('general', async ({ incrementor }) => {
  let returnedValue: number | null = null;
  const asyncInput = async function (v: number) { await new Promise(resolve => setTimeout(resolve, 1000)); return v; }
  const { syncOutput } = asyncToSync({ asyncInput, onReturnValue: v => { returnedValue = v; } });


  syncOutput(1);
  await expect.poll(() => returnedValue).toBe(1);

  syncOutput(2);
  expect(returnedValue).toBe(1);
  syncOutput(3);
  expect(returnedValue).toBe(1);
  syncOutput(4);
  expect(returnedValue).toBe(1);
  await expect.poll(() => returnedValue).toBe(4);
});

test('with debounce/throttle', async () => {
  let returnedValue: number | null = null;
  let pending = false;
  let syncDebouncing = false;
  let asyncDebouncing = false;
  
  // To test the different combinations,
  // we set the async duration to be 1s,
  // the debounce to 0.5s, and the throttle to 2s.
  const asyncInput = async function (v: number) { await new Promise(resolve => setTimeout(resolve, 1000)); return v; }
  const { syncOutput } = asyncToSync({
    asyncInput,
    onReturnValue: v => { returnedValue = v; },
    onAsyncDebounce: a => { asyncDebouncing = a; },
    onSyncDebounce: s => { syncDebouncing = s; },
    onPending: p => { pending = p; },
    debounce: 500,
    throttle: 2000
  });

  // Test sync debouncing
  expect(syncDebouncing).toBe(false);
  
  // Try calling syncOutput with a bunch of different values,
  // each separated by 0.1s.
  // This should result in the the debounce timeout never
  // being reached, so we won't actually call the async handler yet.
  for (let i = 1; i <= 10; ++i) {
    syncOutput(i);
    expect(returnedValue).toBe(null);
    expect(syncDebouncing).toBe(true);
    expect(pending).toBe(false);
    await new Promise(r => setTimeout(r, 100));
    expect(returnedValue).toBe(null);
    expect(syncDebouncing).toBe(true);
    expect(pending).toBe(false);
  }

  // Test async debouncing
  // First, wait for the sync debouncing period to end
  await expect.poll(() => pending).toBe(true);

  // Async function is running,
  // with nothing else in the queue
  expect(syncDebouncing).toBe(false);
  expect(asyncDebouncing).toBe(false);
  expect(returnedValue).toBe(null);

  // Queue another call
  syncOutput(20);

  // The previous call should still be pending
  expect(pending).toBe(true);
  expect(syncDebouncing).toBe(true);
  expect(returnedValue).toBe(null);

  // Wait for the first invocation to finish
  await expect.poll(() => returnedValue).toBe(10);

  // Now that the first one's finished,
  // the next one should be queued,
  // but it should also still be throttled
  expect(syncDebouncing).toBe(true);

  // Wait for the throttle to end
  await expect.poll(() => syncDebouncing).toBe(false);

  // The first invocation already finished,
  // so asyncDebouncing should be false
  expect(asyncDebouncing).toBe(false);
  
  // And eventually, the final value should be set 
  await expect.poll(() => returnedValue).toBe(20);

});

