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
![image](data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCACWASwDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAECBAP/xAAqEAEAAgIBBAEDBAIDAAAAAAAAARECITEDEkFRYSJxgQQTMpHB8BSh4f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDyquNJdc6aASlSq40XXOgUAAAAEmaBRnuIkGhFBFQAZ4aAYi7Jvw2AxzpsAUQAUQFEmU7gaI55pIm2sMYympyiNA11OnPTq5ib9MOqc8Z6us4isf7XuiJzrLHcxWwcg6s8omJrKP5RVSvUmPqjLKOYr4ByFOrLLHuwnvianc3DMdWZ604zP0zrQOcazy7sp3ccQyAAAACVXGi650oAJVcaLrnQJMm4uJv7GXtJ0BMzX2TysbmfSgscAAAAAAAAAAAAAAzuImd/JG4aZy0AsSzHy1jf4BoACJqbhcspzm8tygAuOeWMTETUTygAAAAAigAAAICV60mvMU0AUJVcaLrnQKAAkyqTFgzOuVxlQFEATKdExVTMx/apMWBEtJEUoAABQAlQoAoigAAk/CgAAAAAAAAAJYAAABIMzriaIy9kVOvNmvAKJXrRdcgqXCTNlfVU68fYF7juZ3Vm4Bq4lWPusTQNBE2AXRExJVzH+UmanVA0JHG1AAAVCwUAAAAAANgAADMzas+QCLiaPusamuJBQAATYFFUACZcfHn4VieZBPOliLqI5IvujcfmHR+knD9zKMu2cp/jr739gbj9LjU9+c73WOoT/i9LKPpzm/nZ1en1McpnDUeIry8+h34Zz3zMR7n/AH/IPPPCcM8sc6ieb9/b/f6ZdX6uYvpxf1bqpqv9/DnynHu4y539V/4BImpaZ1r35a2AVBs2Cib9wbBQi/KbBMpSFy+SAImm2J51w1sFE2u/IAbNgAAAAMzHpoBivZENAAAAEgndBE3DMam48LE7BUy8KSDFeS5xnVxlE88Ssx6ImpvX5B0Y/qs4xnuxjKImriaJ/WT2z29OIn5lzUUBM1OU3Fz8a/8AC+Lj8i1v4AjbSVXGi/egVO4upitfJO55/Mg0JGlAABmYGgEiL5aAAAAAAAAAAABFAQAAAEopQEFSZoAOOdEAnbB2woBVBOjnjn17BY59oRNqCdvpLrmKaABKrjRdc6BQAFRQAAAAAAAAEhQAAAAES/NTRkk3PkFibVmNTK3AKAAkxagMVPpYimgAAEmLSe6avetbaASIUAAACZo8WzO+AL9aWMvbMcbaj/oGhKrjRdc6BQASVAAAFxiJyiJmremXRqMqyucfh54V3xMzURL3y6mExneXdE8RXAPLLpzGVYxM69Lj0rxmcpmJjxT3jOMrmMorXOmO7t7+7KIyy3FWDz/bicMsoyn6fEwxOOUVeMxfGnr0+pEYZd07mbr21PUwmf5TvK9eAeMdPOcox7ZiZ9pMTE1MVMOj93Duxnu1Fxw58quam4BmYtmtNpMWDMxpPLXasRQEcAoIAABM0AFgAXAAAAKA868StVpqYtO0EWIWlAABKrjRdc6UAEquNF1zoFAAABYyyx/jMx9pS5mbnYAAAAAAAAAAAigCMcyALF+9JNyADcACgAigAAAAAAAAAADNVxpO+I1MbAH/2Q==)
