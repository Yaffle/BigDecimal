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
<HOW TO PLACE IMAGE HERE???>

<svg width="500" height="200"><defs><filter x="-100%" y="-100%" width="300%" height="300%" id="rablfilter5"><feGaussianBlur in="SourceAlpha" stdDeviation="2"></feGaussianBlur><feOffset dx="0" dy="0"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><filter x="-100%" y="-100%" width="300%" height="300%" id="rablfilter4"><feGaussianBlur in="SourceAlpha" stdDeviation="2"></feGaussianBlur><feOffset dx="0" dy="0"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0.4"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><filter x="-100%" y="-100%" width="300%" height="300%" id="rablfilter3"><feGaussianBlur in="SourceAlpha" stdDeviation="1"></feGaussianBlur><feOffset dx="0" dy="2"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0.2"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><filter x="-100%" y="-100%" width="300%" height="300%" id="rablfilter2"><feGaussianBlur in="SourceAlpha" stdDeviation="2"></feGaussianBlur><feOffset dx="0" dy="1"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0.4"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><filter x="-100%" y="-100%" width="300%" height="300%" id="rablfilter1"><feGaussianBlur in="SourceAlpha" stdDeviation="0"></feGaussianBlur><feOffset dx="0" dy="1"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0.4"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><clipPath id="rablfilter0"><rect x="92.5" y="0.5" width="317" height="178"></rect></clipPath></defs><g><rect x="0" y="0" width="500" height="200" fill="#ffffff" fill-opacity="1" stroke="#ffffff" stroke-opacity="0" stroke-width="0"></rect><rect x="457.71875" y="0.5" width="12" height="12" rx="2" ry="2" fill="#4285f4"></rect><text x="477.71875" y="15.703125" style="cursor: default; user-select: none; -webkit-font-smoothing: antialiased; font-family: Roboto;" fill="#757575" dx="0px">ms</text><rect x="92.5" y="0.5" width="317" height="178" fill="#ffffff" fill-opacity="1" stroke="#ffffff" stroke-opacity="0" stroke-width="1"></rect></g><g><line x1="92.5" x2="92.5" y1="0.5" y2="178.5" stroke="#9E9E9E" stroke-width="1"></line><line x1="251" x2="251" y1="0.5" y2="178.5" stroke="#E0E0E0" stroke-width="1"></line><line x1="409.5" x2="409.5" y1="0.5" y2="178.5" stroke="#E0E0E0" stroke-width="1"></line></g><g><path d="M 129.79201937359176 1 A 2 2 0 0 1 131.79201937359176 3 L 131.79201937359176 14.225563909774433 A 2 2 0 0 1 129.79201937359176 16.225563909774433 L 93 16.225563909774433 A 0 0 0 0 1 93 16.225563909774433 L 93 1 A 0 0 0 0 1 93 1 Z" fill="#4285f4" clip-path="url(#rablfilter0)"></path><path d="M 109.64005199882085 25.962406015037594 A 2 2 0 0 1 111.64005199882085 27.962406015037594 L 111.64005199882085 39.18796992481203 A 2 2 0 0 1 109.64005199882085 41.18796992481203 L 93 41.18796992481203 A 0 0 0 0 1 93 41.18796992481203 L 93 25.962406015037594 A 0 0 0 0 1 93 25.962406015037594 Z" fill="#4285f4" clip-path="url(#rablfilter0)"></path><path d="M 115.02061187454092 50.924812030075174 A 2 2 0 0 1 117.02061187454092 52.924812030075174 L 117.02061187454092 64.15037593984962 A 2 2 0 0 1 115.02061187454092 66.15037593984962 L 93 66.15037593984962 A 0 0 0 0 1 93 66.15037593984962 L 93 50.924812030075174 A 0 0 0 0 1 93 50.924812030075174 Z" fill="#4285f4" clip-path="url(#rablfilter0)"></path><path d="M 128.51827374917534 75.88721804511277 A 2 2 0 0 1 130.51827374917534 77.88721804511277 L 130.51827374917534 89.11278195488723 A 2 2 0 0 1 128.51827374917534 91.11278195488723 L 93 91.11278195488723 A 0 0 0 0 1 93 91.11278195488723 L 93 75.88721804511277 A 0 0 0 0 1 93 75.88721804511277 Z" fill="#4285f4" clip-path="url(#rablfilter0)"></path><path d="M 96.55141461515002 100.84962406015038 A 2 2 0 0 1 98.55141461515002 102.84962406015038 L 98.55141461515002 114.07518796992481 A 2 2 0 0 1 96.55141461515002 116.07518796992481 L 93 116.07518796992481 A 0 0 0 0 1 93 116.07518796992481 L 93 100.84962406015038 A 0 0 0 0 1 93 100.84962406015038 Z" fill="#4285f4" clip-path="url(#rablfilter0)"></path><path d="M 400.0434350044816 125.81203007518796 A 2 2 0 0 1 402.0434350044816 127.81203007518796 L 402.0434350044816 139.0375939849624 A 2 2 0 0 1 400.0434350044816 141.0375939849624 L 93 141.0375939849624 A 0 0 0 0 1 93 141.0375939849624 L 93 125.81203007518796 A 0 0 0 0 1 93 125.81203007518796 Z" fill="#4285f4" clip-path="url(#rablfilter0)"></path><path d="M 104.07585666666273 150.77443609022555 A 2 2 0 0 1 106.07585666666273 152.77443609022555 L 106.07585666666273 164 A 2 2 0 0 1 104.07585666666273 166 L 93 166 A 0 0 0 0 1 93 166 L 93 150.77443609022555 A 0 0 0 0 1 93 150.77443609022555 Z" fill="#4285f4" clip-path="url(#rablfilter0)"></path></g><g></g><g><text x="92.5" y="195.703125" style="cursor: default; user-select: none; -webkit-font-smoothing: antialiased; font-family: Roboto; font-size: 12px;" fill="#757575" dx="-3.369140625px">0</text><text x="251" y="195.703125" style="cursor: default; user-select: none; -webkit-font-smoothing: antialiased; font-family: Roboto; font-size: 12px;" fill="#757575" dx="-7.130859375px">2K</text><text x="409.5" y="195.703125" style="cursor: default; user-select: none; -webkit-font-smoothing: antialiased; font-family: Roboto; font-size: 12px;" fill="#757575" dx="-7.130859375px">4K</text><text x="86.5" y="12.608376409774436" style="cursor: default; user-select: none; -webkit-font-smoothing: antialiased; font-family: Roboto; font-size: 12px;" fill="#757575" dx="-85.869140625px">Jampary_Wasm</text><text x="86.5" y="37.572250939849624" style="cursor: default; user-select: none; -webkit-font-smoothing: antialiased; font-family: Roboto; font-size: 12px;" fill="#757575" dx="-46.76953125px">Jampary</text><text x="86.5" y="62.53612546992481" style="cursor: default; user-select: none; -webkit-font-smoothing: antialiased; font-family: Roboto; font-size: 12px;" fill="#757575" dx="-72.76171875px">BigNumberJs</text><text x="86.5" y="87.5" style="cursor: default; user-select: none; -webkit-font-smoothing: antialiased; font-family: Roboto; font-size: 12px;" fill="#757575" dx="-56.185546875px">DecimalJs</text><text x="86.5" y="112.46387453007517" style="cursor: default; user-select: none; -webkit-font-smoothing: antialiased; font-family: Roboto; font-size: 12px;" fill="#757575" dx="-43.951171875px">BigFloat</text><text x="86.5" y="137.42774906015035" style="cursor: default; user-select: none; -webkit-font-smoothing: antialiased; font-family: Roboto; font-size: 12px;" fill="#757575" dx="-29.923828125px">BigJs</text><text x="86.5" y="162.39162359022555" style="cursor: default; user-select: none; -webkit-font-smoothing: antialiased; font-family: Roboto; font-size: 12px;" fill="#757575" dx="-57.427734375px">BigFloat32</text></g><g></g><g></g><g></g></svg>


