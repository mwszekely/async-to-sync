A small Typescript library that lets you take an `async` function and, with a lot of callbacks, turn it into a normal sync function.

Even if you don't care about all the callbacks (like `onFulfilled`), `asyncToSync` only allows one call at a time (if another call happens, it's delayed until the first finishes). The only required arguments are `asyncInput` (and `capture` for `input` elements). 

This library is unlicensed into the public domain.