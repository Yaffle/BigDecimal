# BigDecimal
a polyfill for decimal propocal - https://github.com/tc39/proposal-decimal

# Usage:

## Type conversion:
`BigDecimal.BigDecimal(string)`
`BigDecimal.BigDecimal(bigint)`
`BigDecimal.BigDecimal(number) (only integers)`
`a.toString()`
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

# Similar projects:
1. https://github.com/MikeMcl/decimal.js/
2. https://github.com/uzyn/bigdenary
...
