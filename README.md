# BigDecimal
a polyfill for decimal propocal - https://github.com/tc39/proposal-decimal
It is implemented on the top of native BigInt.
It can be compiled using https://www.npmjs.com/package/babel-plugin-transform-bigint to use JSBI.

# Usage:

## Installation:
`npm install @yaffle/bigdecimal`

## Type conversion:

`BigDecimal.BigDecimal(string)`

`BigDecimal.BigDecimal(bigint)`

`BigDecimal.BigDecimal(number) (only integers)`

`a.toString()`

`a.toFixed(fractionDigits)`

`a.toPrecision(precision)`

`a.toExponential(fractionDigits)`

`BigDecimal.toBigInt(a)` (not in the spec)

`BigDecimal.toNumber(a)` (not in the spec, only integers)


## Arithmetic:

`BigDecimal.unaryMinus(a)`

`BigDecimal.add(a, b[, rounding])`

`BigDecimal.subtract(a, b[, rounding])`

`BigDecimal.multiply(a, b[, rounding])`

`BigDecimal.divide(a, b, rounding)`

`BigDecimal.round(a, rounding)`

## Comparison:

`BigDecimal.equal(a, b)`

`BigDecimal.lessThan(a, b)`

`BigDecimal.greaterThan(a, b)`

## Math: (not in the spec)

`BigDecimal.log(a, rounding)`

`BigDecimal.exp(a, rounding)`

`BigDecimal.sin(a, rounding)`

`BigDecimal.cos(a, rounding)`

`BigDecimal.atan(a, rounding)`

The `rounding` argument may look like `{maximumFractionDigits: 10, roundingMode: "half-even"}` or `{maximumSignificantDigits: 10, roundingMode: "half-even"}`, where the roundingMode can be "floor", or "ceil", or "half-even", or "half-up".

# BigFloat
Similar to BigDecimal, but uses base 2.

## Example:
```javascript

import {BigDecimal} from './node_modules/@yaffle/bigdecimal/BigDecimal.js';

var pi = BigDecimal.multiply(BigDecimal.BigDecimal(4), BigDecimal.atan(BigDecimal.BigDecimal(1), {maximumSignificantDigits: 1000, roundingMode: 'half-even'}));

console.log(pi.toString());

```

# Similar projects:
1. https://github.com/MikeMcl/decimal.js/
2. https://github.com/uzyn/bigdenary
3. ...
