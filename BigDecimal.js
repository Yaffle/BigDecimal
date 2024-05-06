/*jslint bigint: true, vars: true, indent: 2, esversion:11*/

// https://github.com/tc39/proposal-decimal
// https://en.wikipedia.org/wiki/Floating-point_arithmetic
// https://en.wikipedia.org/wiki/Fixed-point_arithmetic

// Usage:
// BigDecimal(string)
// BigDecimal(number)
// BigDecimal(bigint)

// BigDecimal.unaryMinus(a)
// BigDecimal.add(a, b[, rounding])
// BigDecimal.subtract(a, b[, rounding])
// BigDecimal.multiply(a, b[, rounding])
// BigDecimal.divide(a, b, rounding)
// BigDecimal.cmp(a, b)
// BigDecimal.round(a, rounding)

// a.toString()
// a.toFixed(fractionDigits[, roundingMode = "half-up"])
// a.toPrecision(precision[, roundingMode = "half-up"])
// a.toExponential(fractionDigits[, roundingMode = "half-up"])

// (!) Note: consider to use only "half-even" rounding mode and rounding to a maximum number of significant digits for floating-point arithmetic,
// or only "floor" rounding to a maximum number of fraction digits for fixed-point arithmetic.
// BigFloat may have better performance.

const factory = function (BASE, format = null) {

  const BIGINT_BASE = BigInt(BASE);
  const BASE_LOG2 = Math.log2(BASE);
  const BASE_LOG2_INV = 1 / Math.log2(BASE);
  const NumberSafeBits = Math.floor(Math.log2(Number.MAX_SAFE_INTEGER + 1));
  const parseRegex = /^\s*([+\-])?(\d+)?\.?(\d+)?(?:e([+\-]?\d+))?\s*$/;
  
  const defaultRounding = format === 'decimal128' ? {maximumFractionDigits: 6176, maximumSignificantDigits: 34, maximumExponent: 6144, roundingMode: 'half-even'} : null;

function getExponent(number) {
  const e = Math.floor(Math.log(Math.abs(number)) / Math.log(2)) - 1;
  return Math.abs(number) / 2**e >= 2 ? e + 1 : e;
}

function convert(value) {
  if (value instanceof BigDecimal) {
    return value;
  }
  if (typeof value === "string") {
    if (BASE !== 10) {
      throw new Error();
    }
    if (format != null) {
      if (value === 'Infinity') {
        return create(1n, SPECIAL_EXPONENT);
      }
      if (value === '-Infinity') {
        return create(-1n, SPECIAL_EXPONENT);
      }
      if (value === 'NaN') {
        return create(0n, SPECIAL_EXPONENT);
      }
      if (value === '-0') {
        return create(-1n, -SPECIAL_EXPONENT);
      }
    }
    const match = parseRegex.exec(value);
    if (match == null) {
      throw new RangeError(value);
    }
    const sign = (match[1] || "");
    const integer = (match[2] || "");
    const fraction = (match[3] || "");
    const exponent = (match[4] || "0");
    let result = round(create(BigInt(sign + integer + fraction), diff(Math.abs(exponent) < Number.MAX_SAFE_INTEGER ? exponent : BigInt(match[4] || "0"), (match[3] || "").length)), null);
    if (format != null) {
      if (sign === "-" && result.significand === 0n) {
        result = BigDecimal.unaryMinus(result);
      }
    }
    return result;
  }
  if (typeof value === "number" && Math.floor(value) !== value) {
    if (BASE === 2) {
      const e = getExponent(value);
      const f = value / 2**e;
      const significand = f * (Number.MAX_SAFE_INTEGER + 1) / 2;
      const exponent = e - (NumberSafeBits - 1);
      return create(BigInt(significand), exponent);//TODO: ?
    }
    if (format != null) {
      const e = getExponent(value);
      const f = value / 2**e;
      const significand = f * (Number.MAX_SAFE_INTEGER + 1) / 2;
      const exponent = e - (NumberSafeBits - 1);
      if (exponent >= 0) {
        return BigDecimal.multiply(create(BigInt(significand), 0), create(BigInt(2)**BigInt(exponent), 0));
      } else if (exponent < 0) {
        return BigDecimal.divide(create(BigInt(significand), 0), create(BigInt(2)**BigInt(-exponent), 0));        
      }
    }
  }
  if (value === 0 && 1 / value < 0) {
    if (format != null) {
      return create(-1n, -SPECIAL_EXPONENT); 
    }
    throw new RangeError();
  }
  let a = create(BigInt(value), 0);
  // `normalize` will change the exponent which is not good for fixed-point arithmetic (?)
  //let b = normalize(a, null);
  //while (a !== b) {
  //  a = b;
  //  b = normalize(a, null);
  //}
  if (format != null) {
    a = round(a, defaultRounding);
  }
  return a;
}

function BigDecimal(significand, exponent) {
  if (!(this instanceof BigDecimal)) {
    return convert(significand);
  }
  this.significand = significand;
  this.exponent = exponent;
}

const SPECIAL_EXPONENT = 1/0;

//TODO: remove
const toBigInt = function (a) {
  const e = a.exponent;
  const exponent = typeof e === 'number' ? e : Number(BigInt(e));
  if (exponent === 0) {
    return a.significand;
  }
  if (exponent < 0) {
    const result = bigIntUnscale(a.significand, 0 - exponent);
    if (bigIntScale(result, 0 - exponent) !== BigInt(a.significand)) {
      throw new RangeError("The BigDecimal " + a.toString() + " cannot be converted to a BigInt because it is not an integer");
    }
    return result;
  }
  return bigIntScale(a.significand, exponent);
};

const abs = function (a) {
  return a.significand < 0n ? BigDecimal.unaryMinus(a) : a;
};

function getCountOfDigits(a) { // floor(log(abs(a))/log(BASE)) + 1
  if (a.significand === 0n) {
    throw new RangeError();
  }
  return BigInt(digits(a.significand)) + BigInt(a.exponent);
}
function exponentiateBase(n) {
  return create(BASE, n);
}

function create(significand, exponent) {
  return /*Object.freeze(*/new BigDecimal(significand, exponent)/*)*/;
}
//function bigIntMax(a, b) {
//  return a < b ? b : a;
//}
//function bigIntMin(a, b) {
//  return a < b ? a : b;
//}
function bigIntAbs(a) {
  return a < 0n ? 0n - a : a;
}
// https://github.com/tc39/proposal-bigint/issues/205
// https://github.com/tc39/ecma262/issues/1729
// floor(log2(a)) + 1 if a > 0
function bitLength(a) {
  const s = a.toString(16);
  const c = +s.charCodeAt(0) - +"0".charCodeAt(0);
  if (c <= 0) {
    throw new RangeError();
  }
  return (s.length - 1) * 4 + (32 - Math.clz32(Math.min(c, 8)));
}
function bigIntLog2(n) {
  const k = bitLength(n) - NumberSafeBits;
  const leadingDigits = Number(n >> BigInt(k));
  return Math.log2(leadingDigits) + k;
}
function digits(a) { // floor(log(abs(a)) / log(BASE)) + 1
  a = bigIntAbs(a);
  if (BASE === 2) {
    return bitLength(a);
  }
  const number = Number(BigInt(a));
  if (number < (Number.MAX_SAFE_INTEGER + 1) / 16) {
    return Math.floor(Math.log2(number + 0.5) * BASE_LOG2_INV) + 1;
  }
  const e = (number < 1 / 0 ? Math.log2(number) : bigIntLog2(a)) * BASE_LOG2_INV;
  if (Math.floor(e * (1 - 32 / (Number.MAX_SAFE_INTEGER + 1))) === Math.floor(e) &&
      Math.floor(e * (1 + 32 / (Number.MAX_SAFE_INTEGER + 1))) === Math.floor(e)) {
    return Math.floor(e) + 1;
  }
  const i = Math.floor(e + 0.5);
  return a >= BigInt(cachedPower(i)) ? i + 1 : i;
}
function sum(a, b) {
  if (typeof a === "number" && typeof b === "number") {
    const value = a + b;
    if (Math.abs(value) <= +Number.MAX_SAFE_INTEGER) {
      return value;
    }
  }
  const v = BigInt(a) + BigInt(b);
  const nv = Number(v);
  if (Math.abs(nv) <= +Number.MAX_SAFE_INTEGER) {
    return nv;
  }
  return v;
}
function diff(a, b) {
  return sum(a, typeof b === 'number' ? 0 - b : -BigInt(b));
}
const E = Math.ceil(0.5 * Math.log2(Number.MAX_SAFE_INTEGER + 1) / Math.log2(BASE) - 1);
const N = BigInt(BASE**E);
function normalize(a, rounding) {
  if (rounding == null || rounding.maximumSignificantDigits != null) {
    if (a.significand === 0n) {
      return a.exponent === 0 ? a : create(0n, 0);
    }
    const dividend = a.significand;
    let e = E;
    let divisor = N;
    if (dividend % divisor === 0n) {
      while (dividend % (divisor * divisor) === 0n) {
        divisor *= divisor;
        e *= 2;
      }
      const quotient = dividend / divisor;
      return create(quotient, sum(a.exponent, e));
    }
  }
  return a;
}
function cachedFunction(f) {
  let cache = {};
  let cacheSize = 0;
  return function (k) {
    let lastValue = cache[k];
    if (lastValue == null) {
      if (cacheSize > 100) {
        cache = {};
        cacheSize = 0;
      }
      lastValue = f(k);
      cache[k] = lastValue;
      cacheSize += 1;
    }
    return lastValue;
  };
}
const cachedBigInt = cachedFunction(function (k) {
    // k === maximumFractionDigits
  return BigInt(k);
});
const cachedPower = cachedFunction(function (k) {
  return BIGINT_BASE**BigInt(k);
});

function applyMaxExponent(x, rounding) {
  const maximumExponent = rounding.maximumExponent;
  if (maximumExponent != null) {
    if (digits(x.significand) - 1 + x.exponent > maximumExponent) {
      return x.significand === 0n ? create(0n, 0) : create(x.significand < 0n ? -1n : 1n, SPECIAL_EXPONENT);
    }
  }
  return x;
}

function round(a, rounding) {
  if (format === 'decimal128') {
    if (rounding == null) {
      return round(a, defaultRounding);
    }
    if (Math.abs(a.exponent) === SPECIAL_EXPONENT) {
      return a;
    }
  }
  if (rounding != null) {
    let k = 0;
    const dividend = BigInt(a.significand);
    const exponent = a.exponent;
    const maximumSignificantDigits = rounding.maximumSignificantDigits;
    if (maximumSignificantDigits != null) {
      if (!(maximumSignificantDigits > 0)) {
        throw new RangeError("maximumSignificantDigits should be positive");
      }
      if (dividend === 0n) {
        return create(0n, 0);
      }
      k = Math.max(k, digits(dividend) - maximumSignificantDigits);
    }
    const maximumFractionDigits = rounding.maximumFractionDigits;
    if (maximumFractionDigits != null) {
      if (!(maximumFractionDigits >= 0)) {
        throw new RangeError("maximumFractionDigits should be non-negative");
      }
      k = Math.max(k, 0 - sum(exponent, maximumFractionDigits));
      //k = Math.min(k, digits(a.significand) + 1);
      //if (k < 0 && k >= -1024 && BASE === 2) {
      //  return create(a.significand << BigInt(-k), 0 - maximumFractionDigits);
      //}
    }
    if (k > 0) {
      const roundingMode = rounding.roundingMode;
      let quotient = 0n;
      if (roundingMode === "floor") {
        if (BASE === 2) {
          quotient = dividend >> cachedBigInt(k);
        } else {
          if (dividend >= 0n) {
            quotient = dividend / cachedPower(k);
          } else {
            quotient = (dividend + 1n) / cachedPower(k) - 1n;
          }
        }
      } else if (roundingMode === "down") {
        if (BASE === 2) {
          if (dividend >= 0n) {
            quotient = dividend >> cachedBigInt(k);
          } else {
            quotient = -((-dividend) >> cachedBigInt(k));
          }
        } else {
          quotient = dividend / cachedPower(k)
        }
      } else if (roundingMode === "ceil") {
        if (BASE === 2) {
          quotient = -((-dividend) >> cachedBigInt(k));
        } else {
          if (dividend < 0n) {
            quotient = dividend / cachedPower(k);
          } else {
            quotient = (dividend - 1n) / cachedPower(k) + 1n;
          }
        }
      } else if (roundingMode === "up") {
        if (BASE === 2) {
          if (dividend >= 0n) {
            quotient = -((-dividend) >> cachedBigInt(k));
          } else {
            quotient = dividend >> cachedBigInt(k);
          }
        } else {
          if (dividend >= 0n) {
            quotient = (dividend - 1n) / cachedPower(k) + 1n;
          } else {
            quotient = (dividend + 1n) / cachedPower(k) - 1n;
          }
        }
      } else {
        let divisor = 0n;
        let twoRemainders = 0n;
        if (BASE === 2) {
          const K = cachedBigInt(k);
          divisor = 1n << K;
          if (dividend >= 0n) {
            quotient = dividend >> K;
          } else {
            quotient = -((-dividend) >> K);
          }
          twoRemainders = (dividend - (quotient << K)) * 2n;
        } else {
          divisor = cachedPower(k);
          quotient = dividend / divisor;
          twoRemainders = (dividend - divisor * quotient) * 2n;
        }
        if (twoRemainders !== 0n) {
          if (roundingMode === "half-up") {
            twoRemainders += twoRemainders < 0n ? -1n : 1n;
          } else if (roundingMode === "half-down") {
            twoRemainders += 0n;
          } else if (roundingMode === "half-even") {
            twoRemainders += (quotient % 2n);
          } else {
            throw new RangeError("supported roundingMode (floor/ceil/up/down/half-even/half-up/half-down) is not given");
          }
          if (twoRemainders > divisor) {
            quotient += 1n;
          }
          if (-twoRemainders > divisor) {
            quotient -= 1n;
          }
        }
      }
      const e = sum(exponent, k);
      return applyMaxExponent(create(quotient, e), rounding);
    }
    return applyMaxExponent(a, rounding);
  }
  return a;
}

BigDecimal.unaryMinus = function (a) {
  if (format != null) {
    if (a.exponent === -SPECIAL_EXPONENT) {
      return create(0n, 0);
    }
    if (a.significand === 0n && a.exponent !== SPECIAL_EXPONENT) {
      return create(-1n, -SPECIAL_EXPONENT);
    }
  }
  return create(-BigInt(a.significand), a.exponent);
};

function tonum(x) {
  // converts +0, +-Infinity, NaN to corresponding values, and other values to sign(value)
  return (x.significand < 0n ? -1 : (x.significand > 0n ? +1 : 0)) * (Math.abs(x.exponent) !== SPECIAL_EXPONENT ? 1 : Math.pow(BASE, x.exponent));
}
function fromnum(x) {
  if (x !== x) {
    return create(0n, SPECIAL_EXPONENT);
  }
  if (x === +1/0) {
    return create(1n, SPECIAL_EXPONENT);    
  }
  if (x === -1/0) {
    return create(-1n, SPECIAL_EXPONENT);
  }
  if (x === 0 && 1/x > 0) {
    return create(0n, 0);    
  }
  if (x === 0 && 1/x < 0) {
    return create(-1n, -SPECIAL_EXPONENT);    
  }
  throw new Error(x);
}

BigDecimal.add = function (a, b, rounding = defaultRounding) {
  const as = BigInt(a.significand);
  const bs = BigInt(b.significand);
  const ae = a.exponent;
  const be = b.exponent;
  if (format != null) {
    if (ae === -SPECIAL_EXPONENT || be === -SPECIAL_EXPONENT) {
      if (ae === -SPECIAL_EXPONENT && be !== -SPECIAL_EXPONENT) {
        return round(b, rounding);
      }
      if (be === -SPECIAL_EXPONENT && ae !== -SPECIAL_EXPONENT) {
        return round(a, rounding);
      }
      return create(-1n, -SPECIAL_EXPONENT);
    }
    if (Math.abs(a.exponent) === SPECIAL_EXPONENT || Math.abs(b.exponent) === SPECIAL_EXPONENT) {
      return fromnum(tonum(a) + tonum(b));
    }
  }
  const bd = diff(ae, be);
  const d = typeof bd === 'number' ? bd : Number(BigInt(bd));
  if (d !== 0) { // optimization
    if (as === 0n) {
      return round(b, rounding);
    }
    if (bs === 0n) {
      return round(a, rounding);
    }
    const msdp1 = rounding != null ? rounding.maximumSignificantDigits + 1 : 0;
    if (d > 0) {
      if (msdp1 !== 0 && d > digits(bs) + msdp1) {
        return round(create(bigIntScale(as, msdp1) + (bs < 0n ? -1n : 1n), diff(ae, msdp1)), rounding);
      }
      return round(create(bigIntScale(as, d) + bs, be), rounding);
    }
    if (d < 0) {
      if (msdp1 !== 0 && 0 - d > digits(as) + msdp1) {
        return round(create((as < 0n ? -1n : 1n) + bigIntScale(bs, msdp1), diff(be, msdp1)), rounding);
      }
      return round(create(as + bigIntScale(bs, 0 - d), ae), rounding);
    }
  }
  return round(create(as + bs, ae), rounding);
};
BigDecimal.subtract = function (a, b, rounding = defaultRounding) {
  return BigDecimal.add(a, BigDecimal.unaryMinus(b), rounding);
};
function toSignedZero(a, b, p) {
  if (format != null) {
    if (p.significand === 0n || p.exponent === -SPECIAL_EXPONENT) {
      if (a.significand < 0n) {
        return toSignedZero(BigDecimal.unaryMinus(a), b, BigDecimal.unaryMinus(p));
      }
      if (b.significand < 0n) {
        return toSignedZero(a, BigDecimal.unaryMinus(b), BigDecimal.unaryMinus(p));
      }
    }
  }
  return p;
}
BigDecimal.multiply = function (a, b, rounding = defaultRounding) {
  if (format != null) {
    if (Math.abs(a.exponent) === SPECIAL_EXPONENT || Math.abs(b.exponent) === SPECIAL_EXPONENT) {
      return fromnum(tonum(a) * tonum(b));
    }
  }
  return toSignedZero(a, b, normalize(round(create(BigInt(a.significand) * BigInt(b.significand), sum(a.exponent, b.exponent)), rounding), rounding));
};
function bigIntScale(a, scaling) {
  if (typeof a !== 'bigint') {
    throw new TypeError();
  }
  return (BASE === 2 ? (a << cachedBigInt(scaling)) : cachedPower(scaling) * a);
}
function bigIntUnscale(a, unscaling) {
  if (typeof a !== 'bigint') {
    throw new TypeError();
  }
  return (BASE === 2 ? (a >> cachedBigInt(unscaling)) : a / cachedPower(unscaling));
}
BigDecimal.divide = function (a, b, rounding = defaultRounding) {
  if (format != null) {
    if (Math.abs(a.exponent) === SPECIAL_EXPONENT || Math.abs(b.exponent) === SPECIAL_EXPONENT || b.significand === 0n) {
      return fromnum(tonum(a) / tonum(b));
    }
  }
  const exponent = diff(a.exponent, b.exponent);
  let scaling = 0;
  if (rounding != null && rounding.maximumSignificantDigits != null) {
    scaling = rounding.maximumSignificantDigits + ((b.significand === 0n ? 0 : digits(b.significand)) - (a.significand === 0n ? 0 : digits(a.significand)));
  } else if (rounding != null && rounding.maximumFractionDigits != null) {
    //scaling = BigInt(rounding.maximumFractionDigits) + bigIntMax(a.exponent, 0n) + bigIntMax(0n - b.exponent, 0n) - bigIntMin(a.exponent - b.exponent + BigInt(digits(a.significand) - digits(b.significand)), 0n);
    scaling = sum(rounding.maximumFractionDigits, exponent);
  } else {
    // Try to do exact division:
    scaling = Math.ceil(digits(b.significand) * BASE_LOG2) + 1;
  }
  let dividend = BigInt(scaling > 0 ? bigIntScale(a.significand, scaling) : a.significand);
  let divisor = BigInt(scaling < 0 ? bigIntScale(b.significand, 0 - scaling) : b.significand);
  if (divisor < 0n) {
    dividend = -dividend;
    divisor = -divisor;
  }
  let quotient = 0n;
  if (rounding != null && rounding.roundingMode === "floor") {
    if (dividend >= 0n) {
      quotient = dividend / divisor;
    } else {
      quotient = (dividend + 1n) / divisor - 1n;
    }
  } else if (rounding != null && rounding.roundingMode === "ceil") {
    if (dividend <= 0n) {
      quotient = dividend / divisor;
    } else {
      quotient = (dividend - 1n) / divisor + 1n;
    }
  } else {
    if (dividend < 0n) {
      quotient = ((dividend + 1n) / divisor) - 1n;
    } else {
      quotient = dividend / divisor;
    }
    const remainder = dividend - divisor * quotient;
    console.assert(remainder >= 0n);
    if (remainder !== 0n) {
      if (rounding == null) {
        throw new RangeError("rounding is not given for inexact operation");
      }
      quotient *= BIGINT_BASE**2n;
      scaling = sum(scaling, 2);
      if (remainder * 2n < divisor) {
        quotient += 1n;
      } else if (remainder * 2n === divisor) {
        quotient += BIGINT_BASE**2n / 2n;
      } else {
        quotient += BIGINT_BASE**2n / 2n + 1n;
      }
    } else {
      //TODO: optimize
      while (scaling >= 1 && quotient % BIGINT_BASE === 0n) {
        quotient /= BIGINT_BASE;
        scaling -= 1;
      }
    }
  }
  return toSignedZero(a, b, round(create(quotient, diff(exponent, scaling)), rounding));
};
function cmpnum(a, b) {
  return a < b ? -1 : (b < a ? +1 : (a === b ? 0 : undefined));
}
function compare(a, b) {
  if (format != null) {
    if (Math.abs(a.exponent) === SPECIAL_EXPONENT || Math.abs(b.exponent) === SPECIAL_EXPONENT || b.significand === 0n) {
      return cmpnum(tonum(a), tonum(b));
    }
  }
  const as = BigInt(a.significand);
  const bs = BigInt(b.significand);
  const ae = a.exponent;
  const be = b.exponent;
  const bd = diff(ae, be);
  const d = typeof bd === 'number' ? +bd : Number(BigInt(bd));
  if (d === 0) {
    return as < bs ? -1 : (as > bs ? +1 : 0);
  }
  if (as <= 0n && bs >= 0n) {
    return !(as === 0n && bs === 0n) ? -1 : 0;
  }
  if (as >= 0n && bs <= 0n) {
    return (as === 0n && bs === 0n) ? 0 : +1;
  }
if (BASE !== 2 || d >= 9007199254740992 || d <= -9007199254740992) {
  const x = sum(bd, (digits(as) - digits(bs)));
  const differenceOfLogarithms = typeof x === 'number' ? x : Number(BigInt(x));
  if (differenceOfLogarithms !== 0) {
    return as < 0n && bs < 0n ? (differenceOfLogarithms > 0 ? -1 : +1) : (differenceOfLogarithms < 0 ? -1 : +1);
  }
} else {
  //TODO: remove when bitLength is fast
  const x = d >= 0 ? as : as >> cachedBigInt(0 - d);
  const y = d <= 0 ? bs : bs >> cachedBigInt(d);
  if (x < y) {
    return -1;
  }
  if (y < x) {
    return +1;
  }
  //return x < y ? -1 : (x > y ? +1 : 0);
}
  const x = d <= 0 ? as : bigIntScale(as, d);
  const y = d >= 0 ? bs : bigIntScale(bs, 0 - d);
  return x < y ? -1 : (x > y ? +1 : 0);
}
BigDecimal.cmp = function (a, b) {
  return compare(a, b);
};

BigDecimal.equal = function (a, b) {
  return compare(a, b) === 0;
};
BigDecimal.lessThan = function (a, b) {
  return compare(a, b) < 0;
};
BigDecimal.greaterThan = function (a, b) {
  return compare(a, b) > 0;
};

BigDecimal.round = function (a, rounding) {
  //TODO: quick round algorithm (?)
  return round(a, rounding);
};

BigDecimal.prototype.toString = function () {
  //! https://tc39.es/ecma262/#sec-number.prototype.tostring
  if (BASE !== 10) {
    throw new Error();
  }
  if (arguments.length !== 0) {
    throw new RangeError("not implemented");
  }
  const x = convert(this);
  let significand = x.significand.toString();
  if (format != null) {
    if (Math.abs(x.exponent) === SPECIAL_EXPONENT) {
      return tonum(x).toString();
    }
  }
  //! https://tc39.es/ecma262/#sec-numeric-types-number-tostring
  if (significand === "0") {
    return "0";
  }
  let sign = "";
  if (+significand.charCodeAt(0) === +"-".charCodeAt(0)) {
    significand = significand.slice(1);
    sign = "-";
  }
  const E = sum(x.exponent, significand.length - 1);
  const e = typeof E === 'number' ? E : Number(BigInt(E));
  const normalize = format != null ? false : true;
  const minSignificant = normalize ? 0 : significand.length;
  if (e > -7 && e < 21) {
    return sign + bigDecimalToPlainString(significand, e + 1 - significand.length, 0, minSignificant);
  }
  return sign + bigDecimalToPlainString(significand, -(significand.length - 1), 0, minSignificant) + "e" + (e >= 0 ? "+" : "") + E.toString();
};

function bigDecimalToPlainString(significand, exponent, minFraction, minSignificant) {
  let e = significand.length - 1 + exponent;
  if (e <= -1) {
    significand = String("0".repeat(0 - e)) + significand;
    minSignificant += 0 - e;
    e = 0;
  }
  let fraction = significand.length - (e + 1);
  let i = significand.length;
  while (fraction > minFraction &&
         +i >= +minSignificant &&
         i >= 1 && +significand.charCodeAt(i - 1) === +"0".charCodeAt(0)) {
    i -= 1;
    fraction -= 1;
  }
  if (+i < +significand.length) {
    significand = significand.slice(0, i);
  }
  const zeros = Math.max(minFraction - fraction, +minSignificant - +significand.length);
  if (zeros > 0) {
    significand += String("0".repeat(zeros));
  }
  return significand.length > e + 1 ? significand.slice(0, e + 1) + "." + significand.slice(e + 1) : significand;
}
// Something like Number#toPrecision: when value is between 10**-6 and 10**p? - to fixed, otherwise - to exponential:
function toPrecision(significand, exponent, minSignificant) {
  const E = sum(exponent, significand.length - 1);
  const e = typeof E === 'number' ? E : Number(BigInt(E));
  if (e < -6 || e >= +minSignificant) {
    return bigDecimalToPlainString(significand, -(significand.length - 1), 0, minSignificant) + "e" + (e < 0 ? "" : "+") + E.toString();
  }
  return bigDecimalToPlainString(significand, typeof exponent === 'number' ? exponent : Number(BigInt(exponent)), 0, minSignificant);
}
function toFixed(significand, exponent, minFraction) {
  return bigDecimalToPlainString(significand, exponent, minFraction, 0);
}
function toExponential(significand, exponent, minFraction) {
  const E = sum(exponent, significand.length - 1);
  const e = typeof E === 'number' ? E : Number(BigInt(E));
  return bigDecimalToPlainString(significand, -(significand.length - 1), 0, minFraction + 1) + "e" + (e < 0 ? "" : "+") + E.toString();
}

BigDecimal.prototype.toFixed = function (fractionDigits, roundingMode = "half-up") {
  if (Math.floor(fractionDigits) !== fractionDigits) {
    throw new RangeError();
  }
  if (format != null) {
    if (Math.abs(this.exponent) === SPECIAL_EXPONENT) {
      return tonum(this).toFixed(fractionDigits);
    }
  }
  const value = BASE === 10 ? create(this.significand, sum(this.exponent, fractionDigits)) : BigDecimal.multiply(convert(10n**BigInt(fractionDigits)), this);
  const sign = value.significand < 0n ? "-" : "";
  const rounded = BigDecimal.round(value, {maximumFractionDigits: 0, roundingMode: roundingMode});
  const a = abs(rounded);
  return sign + toFixed(toBigInt(a).toString(), 0 - fractionDigits, fractionDigits);
};

function getDecimalSignificantAndExponent(value, precision, roundingMode) {
  if (BASE === 10) {
    const x = BigDecimal.round(abs(value), {maximumSignificantDigits: precision, roundingMode: roundingMode});
    return {significand: x.significand.toString(), exponent: BigInt(x.exponent)};
  }
  //TODO: fix performance, test
  const exponentiate = function (x, n, rounding) {
    if (n < 0n) {
      return BigDecimal.divide(convert(1), exponentiate(x, -BigInt(n), rounding), rounding);
    }
    let y = undefined;
    while (n >= 1n) {
      if (n % 2n === 0n) {
        x = BigDecimal.multiply(x, x, rounding);
        n /= 2n;
      } else {
        y = y == undefined ? x : BigDecimal.multiply(x, y, rounding);
        n -= 1n;
      }
    }
    return y == undefined ? convert(1) : y;
  };
  const logarithm = function (x, b, rounding) {
    if (BigDecimal.cmp(x, convert(0)) <= 0) {
      throw new RangeError();
    }
    if (BigDecimal.cmp(x, convert(1)) < 0) {
      return 0n - logarithm(BigDecimal.divide(convert(1), x, rounding), b, rounding);
    }
    const digits = getCountOfDigits(x);
    const v = BigInt(Math.max(0, bitLength(digits) - NumberSafeBits));
    const log = BigInt(Math.floor(Number(digits >> v) / Math.log2(b) * BASE_LOG2)) << v;
    if (log < 3n) {
      return log;
    }
    return log + logarithm(BigDecimal.divide(x, exponentiate(convert(b), log, rounding), rounding), b, rounding);
  };
  const sign = value.significand < 0n ? -1 : +1;
  const roundToInteger = function (a) {
    return BigDecimal.round(sign >= 0 ? a : BigDecimal.unaryMinus(a), {maximumFractionDigits: 0, roundingMode: roundingMode});
  };
  if (BigDecimal.cmp(value, convert(0)) === 0) {
    return {significand: "0", exponent: 0n};
  }
  const ten = convert(10);
  const minimumSignificantDigits = Math.pow(2, Math.ceil(Math.log2(bitLength(bigIntAbs(BigInt(value.exponent)) + 1n) * BASE_LOG2_INV)));
  let rounding = {maximumSignificantDigits: Math.max(minimumSignificantDigits, BASE === 2 ? 32 : 8), roundingMode: "half-even"};
  let result = undefined;
  let fd = 0n;
  do {
    let x = abs(value);
    fd = 0n - logarithm(x, 10, rounding);
    x = BigDecimal.multiply(exponentiate(ten, fd, rounding), x, rounding);
    if (BigDecimal.cmp(x, ten) >= 0) {
      fd -= 1n;
      x = BigDecimal.divide(x, ten, rounding);
    }
    if (BigDecimal.cmp(x, convert(1)) < 0) {
      fd += 1n;
      x = BigDecimal.multiply(x, ten, rounding);
    }
    if (BigDecimal.cmp(x, convert(1)) >= 0 && BigDecimal.cmp(x, ten) < 0) {
      fd += BigInt(precision - 1);
      //TODO: ?      
      if (rounding.maximumSignificantDigits > (Math.abs(Number(fd)) + precision) * Math.log2(10) + digits(value.significand)) {
        x = abs(value);
        x = BigDecimal.multiply(x, exponentiate(ten, fd, rounding), rounding)
        result = toBigInt(abs(roundToInteger(x))).toString();
      } else {
        x = BigDecimal.multiply(x, exponentiate(ten, BigInt(precision - 1), rounding), rounding);
        x = abs(x);
        const error = BigDecimal.multiply(BigDecimal.multiply(convert(bigIntAbs(fd) + BigInt(precision)), exponentiateBase(0 - rounding.maximumSignificantDigits)), x);
        if (BigDecimal.cmp(roundToInteger(BigDecimal.add(x, error)), roundToInteger(BigDecimal.subtract(x, error))) === 0) {
          result = toBigInt(abs(roundToInteger(x))).toString();
        }
      }
    }
    rounding = {maximumSignificantDigits: rounding.maximumSignificantDigits * 2, roundingMode: "half-even"};
  } while (result == undefined);
  return {significand: result, exponent: -fd};
}

BigDecimal.prototype.toPrecision = function (precision, roundingMode = "half-up") {
  if (format != null) {
    if (Math.abs(this.exponent) === SPECIAL_EXPONENT) {
      return tonum(this).toPrecision(precision);
    }
  }
  const tmp = getDecimalSignificantAndExponent(this, precision, roundingMode);
  return (BigDecimal.cmp(this, convert(0)) < 0 ? "-" : "") + toPrecision(tmp.significand, tmp.exponent, precision);
};

BigDecimal.prototype.toExponential = function (fractionDigits, roundingMode = "half-up") {
  if (format != null) {
    if (Math.abs(this.exponent) === SPECIAL_EXPONENT) {
      return tonum(this).toExponential(fractionDigits);
    }
  }
  const tmp = getDecimalSignificantAndExponent(this, fractionDigits + 1, roundingMode);
  return (BigDecimal.cmp(this, convert(0)) < 0 ? "-" : "") + toExponential(tmp.significand, tmp.exponent, fractionDigits);
};

  return BigDecimal;
};

const BigDecimal = factory(10);
const BigFloat = factory(2);
const Decimal128 = factory(10, 'decimal128');

export {BigDecimal, BigFloat, Decimal128};
