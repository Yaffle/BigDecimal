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
    a.toFixed(fractionDigits)
    a.toPrecision(precision)
    a.toExponential(fractionDigits)
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

    BigDecimal.log(a, rounding)
    BigDecimal.exp(a, rounding)
    BigDecimal.sin(a, rounding)
    BigDecimal.cos(a, rounding)
    BigDecimal.atan(a, rounding)

The `rounding` argument may look like `{maximumFractionDigits: 10, roundingMode: "half-even"}` or `{maximumSignificantDigits: 10, roundingMode: "half-even"}`, where the roundingMode can be "floor", or "ceil", or "half-even", or "half-up".

# BigFloat
Similar to BigDecimal, but uses base 2.

## Example:
```javascript

import {BigDecimal} from "./node_modules/@yaffle/bigdecimal/BigDecimal.js";

var pi = BigDecimal.multiply(BigDecimal.BigDecimal(4), BigDecimal.atan(BigDecimal.BigDecimal(1), {maximumSignificantDigits: 1000, roundingMode: "half-even"}));

console.log(pi.toString());

```

# Note:
Consider to use only "half-even" rounding mode and rounding to a maximum number of significant digits for floating-point arithmetic,
or only "floor" rounding to a maximum number of fraction digits for fixed-point arithmetic.
BigFloat may have better performance.
Use to round to an integer `BigDecimal.round(a, {maximumFractionDigits: 0, roundingMode: "half-even"})`.


# Similar projects:
1. https://github.com/MikeMcl/decimal.js/
2. https://github.com/uzyn/bigdenary
3. ...

# Benchmark results:
![image](data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCACWASwDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAEC/8QAJRABAAIBAgYDAAMAAAAAAAAAAAERITFBElFhcZHwAoGhwdHh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AMigAgCgAAAAgKIAoAAACKgAAAKAAAAAIAoiwCzFI3eddi9cxtuDA3PfeKJ3+qBgb5Z35pea2BkJAAAAAQUAEAAAAAFQBUAFQAAAFQAABUAAAAAFAALsACwAAAAAAAAAABBQEAAAAAAAAAAAAAAAABQRQAAAAAAAAAAAAAAAEUBFAQAAAAAAQBRAFEAUAAAAABQABAUAAAAAAAAABFQAAAAAAAAAEABv41c6XtjvfYF4ec+MJwxtJMTt4T43E5997gkxVxPvb3wjfy257ZqvfpnHXz/gIqKAAAAAAAAAqAKAAAAAAAAigIKAgoCAAAAAAhp3/VQG+Kd4vrocfT9YAOf9e0CgigAAAAAKAgoCKAAAAAAAAAAAAACKAgqAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAACiAKAAAAAAvDrnRI1amYzm+QJXfwV+dGr/jol1ecz3BKxOdOiVLUTibLjnvYM1I3cY+2AQVAAAFABFAEVAAAFRQQUARQEAAFAAAQUAEAUAAAAAAAAAAAAAAAAABAAAAABQAAAAAAAAAAAAAQsAf/2Q==)
![Hello World](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAUCAAAAAAVAxSkAAABrUlEQVQ4y+3TPUvDQBgH8OdDOGa+oUMgk2MpdHIIgpSUiqC0OKirgxYX8QVFRQRpBRF8KShqLbgIYkUEteCgFVuqUEVxEIkvJFhae3m8S2KbSkcFBw9yHP88+eXucgH8kQZ/jSm4VDaIy9RKCpKac9NKgU4uEJNwhHhK3qvPBVO8rxRWmFXPF+NSM1KVMbwriAMwhDgVcrxeMZm85GR0PhvGJAAmyozJsbsxgNEir4iEjIK0SYqGd8sOR3rJAGN2BCEkOxhxMhpd8Mk0CXtZacxi1hr20mI/rzgnxayoidevcGuHXTC/q6QuYSMt1jC+gBIiMg12v2vb5NlklChiWnhmFZpwvxDGzuUzV8kOg+N8UUvNBp64vy9q3UN7gDXhwWLY2nMC3zRDibfsY7wjEkY79CdMZhrxSqqzxf4ZRPXwzWJirMicDa5KwiPeARygHXKNMQHEy3rMopDR20XNZGbJzUtrwDC/KshlLDWyqdmhxZzCsdYmf2fWZPoxCEDyfIvdtNQH0PRkH6Q51g8rFO3Qzxh2LbItcDCOpmuOsV7ntNaERe3v/lP/zO8yn4N+yNPrekmPAAAAAElFTkSuQmCC)

