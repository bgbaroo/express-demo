# Software tests

Tests are central to software development. Unlike manual testing,
writing tests allow us to programatically test the functionality
and correctness of our programs, and catch those bugs before
they surface.

Humans are smart and stupid at the same time, so we should not
trust ourselves to always produce correct code.

If we're more smart than stupid, then we should be more
willing to spend a little amount of our time to write some
good, smart tests, so that we get to spend our smartness elsewhere
(e.g. in writing new features) instead of chasing down production bugs.

## Unit tests

The simplest kind of tests are _unit tests_, so called because they
only test a unit of our code.

The unit can be any unit of code - from a function, a class, etc.

For example, let's say we want to write code that computes compounded
return on investment.

For a single period, given capital `amount` and interest rate `interest`,
the math to find the returned amount `return` is simple:

```
return = amount x (1+interest)
```

For > 1 periods, e.g. 3, the math still remains simple, but with added
complexity:

```
returnPeriod1 = amount x (1+interest)
returnPeriod2 = returnPeriod1 x (1+interest)
return = returnPeriod2 x (1+interest)
```

This can be codified in TypeScript like so:

```typescript
function mul(a: number, b: number): number {
  return a * b;
}

function periodReturn(amount: number, interest: number): number {
  return mul(amount, 1 + interest);
}

// e.g. 10 => 0.1, and 5 => 0.05
function fromPercent(n: number): number {
  return n / 100;
}

function compound(
  amount: number,
  interestPercent: number,
  periods: number,
): number {
  const interest = fromPercent(interestPercent);

  for (let i = 1; i < periods; i++) {
    amount = periodReturn(amount, interest);
  }

  return amount;
}
```

So, based on the math, an amount of `100` with interest of `1%` should
yield a return of `101` over a single period.

Let's try it out:

```typescript
console.log(compound(100, 1, 1)); // Prints 100
```

What? Why our code failed us just to do this simple math?
And if the code is buggy, which part is buggy?

This question might be easy to answer if the code is
small like the one above, but what if the bug affected
a large portion of code, say, 10000 lines of code, how do we chase it?

The solution is easy, just write unit tests!

## Installing `jest`

Jest is a JavaScript test frameworks that is the de facto standard.
We can use Jest with our TypeScript code by installing the following
packages:

```shell
npm install --save-dev jest @types/jest ts-jest;
```

This installs a new `npx` script `jest`.

Since Jest was designed for JavaScript, we must configure it to transpile
TypeScript when testing with Jest. Jest configuration is done in `jest.config.js`,
but we're too lazy to write that ourselves, so we'll use a script from `ts-jest`
to ininitialize Jest configuration file:

```shell
npx ts-jest config:init;
```

This creates `jest.config.js` at our project root.
For now, we'll leave the file untouched.

Now, let's write unit tests for our functions. Start by creating a new file,
e.g. `bank_return.test.ts` (Jest TypeScript test files have `.test.ts` extensions):

> Test files are usually placed in separate top-level directory `test`.
> You can still place them inside `src`, but don't forget to exclude the
> test files from `tsc` compilation sources by excluding the wildcard `*.test.ts`.

```typescript
import { mul, periodReturn, fromPercent, compound } from "./bank_return";

// describe defines a test suite
describe("mul", () => {
  // Keyword `test` and `it` define a test for Jest
  it("multiply with 0 should give 0", () => {
    expect(mul(0, 0)).toEqual(0);
    expect(mul(0, 1)).toEqual(0);
    expect(mul(2, 0)).toEqual(0);
  });

  it("multiply x with 1 should give x", () => {
    expect(mul(1, 7)).toEqual(7);
    expect(mul(7, 1)).toEqual(7);
    expect(mul(2, 1)).toEqual(2);
  });

  it("basic multiplication", () => {
    expect(mul(2, 2)).toEqual(4);
    expect(mul(5, 10)).toEqual(50);
  });
});

describe("fromPercent", () => {
  it("100% is whole 1", () => {
    expect(fromPercent(100)).toEqual(1);
  });

  it("0% is 0", () => {
    expect(fromPercent(0)).toEqual(0);
  });

  it("unexpected fromPercent value", () => {
    expect(fromPercent(2)).toEqual(0.02);
    expect(fromPercent(5)).toEqual(0.02);
    expect(fromPercent(10)).toEqual(0.1);
  });
});

describe("compound", () => {
  it("0 interest => unchanged amount", () => {
    expect(periodReturn(100, 0, 1)).toEqual(100);
    expect(periodReturn(69, 0, 1)).toEqual(69);
  });

  it("unexpected periodReturn value", () => {
    expect(periodReturn(100, 10)).toEqual(110); // 100 x 1.1
    expect(periodReturn(100, 20)).toEqual(120); // 100 x 1.2
  });
});

describe("compound", () => {
  it("0 interest => unchanged amount", () => {
    expect(periodReturn(100, 10, 0)).toEqual(100); // 100 x 1.1
  });
  it("unexpected compound value", () => {
    expect(periodReturn(100, 10, 1)).toEqual(110); // 100 x 1.1
    expect(periodReturn(100, 10, 2)).toEqual(121); // (100 x 1.1) x 1.1
  });
});
```

And we can run the tests with:

```shell
npx jest;
```

Jest will scan all files with `*.test.ts` or `*.test.js` in our project,
and run tests in those files. Tests are defined with `describe` function calls.

From the tests, it seems the bug comes from `"compound"` => `"unexpected compound value"`.
This helps us rule out other code as buggy, and we can just focus on
fixing that function.

The bug seems to come from the fact that our for loop is initialized with
incorrect `i` counter - so here's the fixed version of `compound`, with
`i` initialized to `0` instead of `1`:

```typescript
function compound(
  amount: number,
  interestPercent: number,
  periods: number,
): number {
  const interest = fromPercent(interestPercent);

  for (let i = 0; i < periods; i++) {
    amount = periodReturn(amount, interest);
  }

  return amount;
}
```

Write tests, save lives!

## Integration tests

> TODO
