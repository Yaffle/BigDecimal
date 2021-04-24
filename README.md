# BigDecimal
a polyfill for decimal propocal - https://github.com/tc39/proposal-decimal
It is implemented on the top of native BigInt.
It can be compiled using https://www.npmjs.com/package/babel-plugin-transform-bigint to use JSBI.

# Usage:

## Installation:
`npm install @yaffle/bigdecimal`

## Type conversion:

    BigDecimal.BigDecimal(string)
    BigDecimal.BigDecimal(bigint)
    BigDecimal.BigDecimal(number) // (only integers)
    a.toString()
    a.toFixed(fractionDigits[, roundingMode = "half-up"])
    a.toPrecision(precision[, roundingMode = "half-up"])
    a.toExponential(fractionDigits[, roundingMode = "half-up"])
    BigDecimal.toBigInt(a) // (not in the spec)
    BigDecimal.toNumber(a) // (not in the spec, only integers)


## Arithmetic:

    BigDecimal.unaryMinus(a)
    BigDecimal.add(a, b[, rounding])
    BigDecimal.subtract(a, b[, rounding])
    BigDecimal.multiply(a, b[, rounding])
    BigDecimal.divide(a, b, rounding)
    BigDecimal.round(a, rounding)

## Comparison:

    BigDecimal.equal(a, b)
    BigDecimal.lessThan(a, b)
    BigDecimal.greaterThan(a, b)

## Math: (not in the spec)

    BigDecimal.abs(a)
    BigDecimal.sign(a)
    BigDecimal.max(a, b)
    BigDecimal.min(a, b)

    BigDecimal.log(a, rounding)
    BigDecimal.exp(a, rounding)
    BigDecimal.sin(a, rounding)
    BigDecimal.cos(a, rounding)
    BigDecimal.atan(a, rounding)

The `rounding` argument may look like `{maximumFractionDigits: 10, roundingMode: "half-even"}` or `{maximumSignificantDigits: 10, roundingMode: "half-even"}`,
where the `roundingMode` can be:
 * `"floor"`
 * `"ceil"`
 * `"half-even"`
 * `"half-up"`
 * `"half-down"`.

# BigFloat
Similar to BigDecimal, but uses base 2.

## Example:
```javascript

import {BigDecimal} from "./node_modules/@yaffle/bigdecimal/BigDecimal.js";

const rounding = {maximumSignificantDigits: 1000, roundingMode: "half-even"};
let pi = BigDecimal.multiply(BigDecimal.BigDecimal(4), BigDecimal.atan(BigDecimal.BigDecimal(1), rounding));

console.log(pi.toString());

```

# Note:
* Consider to use only "half-even" rounding mode and rounding to a maximum number of significant digits for floating-point arithmetic,
  or only "floor" rounding to a maximum number of fraction digits for fixed-point arithmetic.
* For the best performance use BigFloat and rounding like {maximumFractionDigits: number, roundingMode: "floor"}.
* Use to round to an integer `BigDecimal.round(a, {maximumFractionDigits: 0, roundingMode: "half-even"})`.


# Similar projects:
1. https://github.com/MikeMcl/decimal.js/ (decimal)
2. https://github.com/uzyn/bigdenary (decimal)
3. https://github.com/MikeMcl/big.js/ (decimal)
4. https://github.com/MikeMcl/bignumber.js/ (decimal)
5. https://github.com/davidmartinez10/bigfloat#readme (decimal)
6. https://github.com/plow-technologies/bs-Zarith (decimal)
7. https://github.com/royNiladri/js-big-decimal (decimal)
8. https://github.com/charto/bigfloat (binary)
9. https://github.com/munsocket/jampary (binary)
10. ...

# Benchmark results:

Results of running the benchmark from https://github.com/munsocket/jampary#early-stage-results-without-wasm-and-fma :

| library      | time    |
|--------------|---------|
| Jampary_Wasm | 466 ms  |
| Jampary      | 204 ms  |
| BigNumberJs  | 263 ms  |
| DecimalJs    | 424 ms  |
| BigFloat     | 85 ms   |
| BigDecimal   | 135 ms  |
| BigJs        | 3403 ms |
| BigFloat32   | 158 ms  |
