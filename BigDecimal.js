/*jslint bigint: true, vars: true, indent: 2*/

// Usage:
// BigDecimal.BigDecimal(bigint)
// BigDecimal.BigDecimal(string)
// BigDecimal.BigDecimal(number) (only integers)
// BigDecimal.toBigInt(a) (not in the spec)
// BigDecimal.toNumber(a) (not in the spec, only integers)
// BigDecimal.unaryMinus(a)
// BigDecimal.add(a, b[, rounding])
// BigDecimal.subtract(a, b[, rounding])
// BigDecimal.multiply(a, b[, rounding])
// BigDecimal.divide(a, b, rounding)
// BigDecimal.lessThan(a, b)
// BigDecimal.greaterThan(a, b)
// BigDecimal.equal(a, b)
// BigDecimal.round(a, rounding)
// a.toString()
// a.toFixed(fractionDigits[, roundingMode = "half-up"])
// a.toPrecision(precision[, roundingMode = "half-up"])
// a.toExponential(fractionDigits[, roundingMode = "half-up"])
// Math: (not in the spec)
// BigDecimal.log(a, rounding)
// BigDecimal.exp(a, rounding)
// BigDecimal.sin(a, rounding)
// BigDecimal.cos(a, rounding)
// BigDecimal.atan(a, rounding)
// (!) Note: consider to use only "half-even" rounding mode and rounding to a maximum number of significant digits for floating-point arithmetic,
// or only "floor" rounding to a maximum number of fraction digits for fixed-point arithmetic.
// BigFloat may have better performance.


const factory = function (BASE) {

  const BIGINT_BASE = BigInt(BASE);

function BigDecimal(significand, exponent) {
  this.significand = significand;
  this.exponent = exponent;
}
BigDecimal.BigFloat = BigDecimal.BigDecimal = function (value) {
  if (value instanceof BigDecimal) {
    return value;
  }
  if (typeof value === "string") {
    if (BASE !== 10) {
      throw new Error();
    }
    const match = /^\s*([+\-])?(\d+)?\.?(\d+)?(?:e([+\-]?\d+))?\s*$/.exec(value);
    if (match == null) {
      throw new RangeError();
    }
    const exponent = Number(match[4] || "0");
    return create(BigInt((match[1] || "") + (match[2] || "") + (match[3] || "")), diff(Math.abs(exponent) < Number.MAX_SAFE_INTEGER ? exponent : BigInt(match[4] || "0"), (match[3] || "").length));
  }
  if (typeof value === "number" && Math.floor(value) !== value) {
    if (BASE === 2) {
      const e = getExponent(value);
      const f = value / 2**e;
      const significand = f * (Number.MAX_SAFE_INTEGER + 1) / 2;
      const exponent = e - (Math.floor(Math.log2(Number.MAX_SAFE_INTEGER + 1)) - 1);
      return create(BigInt(significand), exponent);//TODO: ?
    }
  }
  let a = create(BigInt(value), 0);
  // `normalize` will change the exponent which is not good for fixed-point arithmetic (?)
  /*let b = normalize(a, null);
  while (a !== b) {
    a = b;
    b = normalize(a, null);
  }*/
  return a;
};
BigDecimal.toNumber = function (a) {
  return Number(BigDecimal.toBigInt(a));
};
BigDecimal.toBigInt = function (a) {
  if (a.exponent === 0) {
    return a.significand;
  }
  if (Number(a.exponent) < 0 && a.significand % BIGINT_BASE**BigInt(-a.exponent) !== 0n) {
    throw new RangeError("The BigDecimal " + a.toString() + " cannot be converted to a BigInt because it is not an integer");
  }
  return Number(a.exponent) < 0 ? a.significand / BIGINT_BASE**BigInt(-a.exponent) : BIGINT_BASE**BigInt(a.exponent) * a.significand;
};
function create(significand, exponent) {
  return /*Object.freeze(*/new BigDecimal(significand, exponent)/*)*/;
}
function bigIntMax(a, b) {
  return a < b ? b : a;
}
function bigIntMin(a, b) {
  return a < b ? a : b;
}
function bigIntAbs(a) {
  return a < 0n ? -a : a;
}
// https://github.com/tc39/proposal-bigint/issues/205
// https://github.com/tc39/ecma262/issues/1729
// floor(log2(a)) + 1 if a > 0
function bitLength(a) {
  const s = a.toString(16);
  const c = s.charCodeAt(0) - '0'.charCodeAt(0);
  if (c <= 0) {
    throw new RangeError();
  }
  return (s.length - 1) * 4 + (32 - Math.clz32(Math.min(c, 8)));
}
function bigIntLog2(n) {
  const k = bitLength(n) - Math.floor(Math.log2(Number.MAX_SAFE_INTEGER + 1));
  const leadingDigits = Number(n >> BigInt(k));
  return Math.log2(leadingDigits) + k;
}
function digits(a) { // floor(log(abs(a)) / log(BASE)) + 1
  a = bigIntAbs(a);
  if (BASE === 2) {
    return bitLength(a);
  }
  const number = Number(a);
  if (number < (Number.MAX_SAFE_INTEGER + 1) / 16) {
    return Math.floor(Math.log2(number + 0.5) / Math.log2(BASE)) + 1;
  }
  const e = (number < 1 / 0 ? Math.log2(number) : bigIntLog2(a)) / Math.log2(BASE);
  if (Math.floor(e * (1 - 32 / (Number.MAX_SAFE_INTEGER + 1))) === Math.floor(e) &&
      Math.floor(e * (1 + 32 / (Number.MAX_SAFE_INTEGER + 1))) === Math.floor(e)) {
    return Math.floor(e) + 1;
  }
  const i = Math.floor(e + 0.5);
  return a >= BIGINT_BASE**BigInt(i) ? i + 1 : i;
}
function sum(a, b) {
  if (typeof a === "number" && typeof b === "number") {
    const value = a + b;
    if (value >= -Number.MAX_SAFE_INTEGER && value <= +Number.MAX_SAFE_INTEGER) {
      return value;
    }
  }
  const v = BigInt(a) + BigInt(b);
  const nv = Number(v);
  if (nv >= -Number.MAX_SAFE_INTEGER && nv <= +Number.MAX_SAFE_INTEGER) {
    return nv;
  }
  return v;
}
function diff(a, b) {
  return sum(a, -b);
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
let cache = {};
let cacheSize = 0;
function cachedBigInt(k) {
  // k === maximumFractionDigits
  var lastValue = cache[k];
  if (lastValue == null) {
    if (cacheSize > 10) {
      cache = {};
      cacheSize = 0;
    }
    lastValue = BigInt(k);
    cache[k] = lastValue;
    cacheSize += 1;
  }
  return lastValue;
}
let cache2 = {};
let cache2Size = 0;
function cachedPower(k) {
  var lastValue = cache2[k];
  if (lastValue == null) {
    if (cache2Size > 10) {
      cache2 = {};
      cache2Size = 0;
    }
    lastValue = BIGINT_BASE**BigInt(k);
    cache2[k] = lastValue;
    cache2Size += 1;
  }
  return lastValue;
}
function round(a, rounding) {
  if (rounding != null) {
    let k = 0;
    const dividend = a.significand;
    const exponent = a.exponent;
    const maximumSignificantDigits = rounding.maximumSignificantDigits;
    if (maximumSignificantDigits != null) {
      if (!(maximumSignificantDigits > 0)) {
        throw new RangeError("maximumSignificantDigits should be positive");
      }
      if (dividend === 0n) {
        return create(0n, 0);
      }
      k = digits(dividend) - maximumSignificantDigits;
    }
    const maximumFractionDigits = rounding.maximumFractionDigits;
    if (maximumFractionDigits != null) {
      if (!(maximumFractionDigits >= 0)) {
        throw new RangeError("maximumFractionDigits should be non-negative");
      }
      k = 0 - Number(sum(exponent, maximumFractionDigits));
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
      } else {
        const divisor = BASE === 2 ? 1n << cachedBigInt(k) : cachedPower(k);
        quotient = dividend / divisor;
        let twoRemainders = (dividend - divisor * quotient) * 2n;
        if (twoRemainders !== 0n) {
          if (roundingMode === "half-up") {
            twoRemainders += twoRemainders < 0n ? -1n : 1n;
          } else if (roundingMode === "half-down") {
            twoRemainders += 0n;
          } else if (roundingMode === "half-even") {
            twoRemainders += (quotient % 2n);
          } else {
            throw new RangeError("supported roundingMode (floor/ceil/half-even/half-up/half-down) is not given");
          }
          if (twoRemainders > divisor) {
            quotient += 1n;
          }
          if (-twoRemainders > divisor) {
            quotient -= 1n;
          }
        }
      }
      return create(quotient, sum(exponent, k));
    }
  }
  return a;
}
BigDecimal.unaryMinus = function (a) {
  return create(-a.significand, a.exponent);
};
BigDecimal.add = function (a, b, rounding = null) {
  const bd = diff(a.exponent, b.exponent);
  const d = Number(bd);
  if (d !== 0) { // optimization
    if (a.significand === 0n) {
      return round(b, rounding);
    }
    if (b.significand === 0n) {
      return round(a, rounding);
    }
    if (d > 0) {
      if (rounding != null && rounding.maximumSignificantDigits != null && d > digits(b.significand) + (rounding.maximumSignificantDigits + 1)) {
        return round(create(bigIntScale(a.significand, rounding.maximumSignificantDigits + 1) + (b.significand < 0n ? -1n : 1n), diff(a.exponent, rounding.maximumSignificantDigits + 1)), rounding);
      }
      return round(create(bigIntScale(a.significand, bd) + b.significand, b.exponent), rounding);
    }
    if (d < 0) {
      if (rounding != null && rounding.maximumSignificantDigits != null && 0 - d > digits(a.significand) + (rounding.maximumSignificantDigits + 1)) {
        return round(create((a.significand < 0n ? -1n : 1n) + bigIntScale(b.significand, rounding.maximumSignificantDigits + 1), diff(b.exponent, rounding.maximumSignificantDigits + 1)), rounding);
      }
      return round(create(a.significand + bigIntScale(b.significand, -bd), a.exponent), rounding);
    }
  }
  return round(create(a.significand + b.significand, a.exponent), rounding);
};
BigDecimal.subtract = function (a, b, rounding = null) {
  return BigDecimal.add(a, BigDecimal.unaryMinus(b), rounding);
};
BigDecimal.multiply = function (a, b, rounding = null) {
  return normalize(round(create(a.significand * b.significand, sum(a.exponent, b.exponent)), rounding), rounding);
};
function bigIntScale(a, scaling) {
  return (BASE === 2 ? (a << cachedBigInt(scaling)) : cachedPower(scaling) * a);
}
BigDecimal.divide = function (a, b, rounding = null) {
  if (a.significand === 0n) {
    return a;
  }
  const exponent = diff(a.exponent, b.exponent);
  let scaling = 0;
  if (rounding != null && rounding.maximumSignificantDigits != null) {
    scaling = rounding.maximumSignificantDigits + (digits(b.significand) - digits(a.significand));
  } else if (rounding != null && rounding.maximumFractionDigits != null) {
    //scaling = BigInt(rounding.maximumFractionDigits) + bigIntMax(a.exponent, 0n) + bigIntMax(0n - b.exponent, 0n) - bigIntMin(a.exponent - b.exponent + BigInt(digits(a.significand) - digits(b.significand)), 0n);
    scaling = sum(rounding.maximumFractionDigits, exponent);
  } else {
    // Try to do exact division:
    scaling = Math.ceil(digits(b.significand) * Math.log2(BASE)) + 1;
  }
  let dividend = (scaling > 0 ? bigIntScale(a.significand, scaling) : a.significand);
  let divisor = (scaling < 0 ? bigIntScale(b.significand, -scaling) : b.significand);
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
    }
  }
  return round(create(quotient, diff(exponent, scaling)), rounding);
};
function compare(a, b) {
  if (a.exponent === b.exponent) {
    return a.significand < b.significand ? -1 : (a.significand > b.significand ? +1 : 0);
  }
  if (a.significand <= 0n && b.significand >= 0n) {
    return !(a.significand === 0n && b.significand === 0n) ? -1 : 0;
  }
  if (a.significand >= 0n && b.significand <= 0n) {
    return (a.significand === 0n && b.significand === 0n) ? 0 : +1;
  }
if (BASE !== 2) {
  const differenceOfLogarithms = Number(sum(diff(a.exponent, b.exponent), (digits(a.significand) - digits(b.significand))));
  if (differenceOfLogarithms !== 0) {
    return a.significand < 0n && b.significand < 0n ? (differenceOfLogarithms > 0 ? -1 : +1) : (differenceOfLogarithms < 0 ? -1 : +1);
  }
} else {
  const x = a.exponent >= b.exponent ? a.significand : a.significand >> cachedBigInt(diff(b.exponent, a.exponent));
  const y = b.exponent >= a.exponent ? b.significand : b.significand >> cachedBigInt(diff(a.exponent, b.exponent));
  if (x < y) {
    return -1;
  }
  if (y < x) {
    return +1;
  }
  //return x < y ? -1 : (x > y ? +1 : 0);
}
  const x = a.exponent <= b.exponent ? a.significand : bigIntScale(a.significand, diff(a.exponent, b.exponent));
  const y = b.exponent <= a.exponent ? b.significand : bigIntScale(b.significand, diff(b.exponent, a.exponent));
  return x < y ? -1 : (x > y ? +1 : 0);
}
BigDecimal.lessThan = function (a, b) {
  return compare(a, b) < 0;
};
BigDecimal.greaterThan = function (a, b) {
  return compare(a, b) > 0;
};
BigDecimal.equal = function (a, b) {
  return compare(a, b) === 0;
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
  let x = BigDecimal.BigDecimal(this);
  //! https://tc39.es/ecma262/#sec-numeric-types-number-tostring
  if (BigDecimal.equal(x, BigDecimal.BigDecimal(0))) {
    return "0";
  }
  let sign = "";
  if (BigDecimal.lessThan(x, BigDecimal.BigDecimal(0))) {
    x = BigDecimal.unaryMinus(x);
    sign = "-";
  }
  const getSignificand = function (a, log10) {
    const s = BigDecimal.divide(a, exponentiate(BigDecimal.BigDecimal(10), log10));
    let m = BigDecimal.BigDecimal(10**15);
    while (!BigDecimal.equal(BigDecimal.round(BigDecimal.multiply(s, m), {maximumFractionDigits: 0, roundingMode: "half-even"}), BigDecimal.multiply(s, m))) {
      m = BigDecimal.multiply(m, m);
    }
    return BigDecimal.toBigInt(BigDecimal.multiply(s, m)).toString().replace(/0+$/g, "") || "0";
  };
  const e = getCountOfDigits(x);
  const significand = getSignificand(x, e);
  if (!BigDecimal.greaterThan(BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.BigDecimal(10**6)), x) &&
      BigDecimal.lessThan(x, BigDecimal.BigDecimal(10**21))) {
    return sign + bigDecimalToPlainString(significand, Number(e - BigInt(significand.length)), 0, 0);
  }
  return sign + bigDecimalToPlainString(significand, -(significand.length - 1), 0, 0) + "e" + (e - 1n >= 0n ? "+" : "") + (e - 1n).toString();
};

function bigDecimalToPlainString(significand, exponent, minFraction, minSignificant) {
  let e = exponent + significand.length - 1;
  significand = significand.replace(/0+$/g, "");
  const zeros = Math.max(0, Math.max(e + 1, minSignificant) - significand.length);
  if (e <= -1) {
    significand = "0".repeat(0 - e) + significand;
    e = 0;
  }
  significand += "0".repeat(zeros);
  significand += "0".repeat(Math.max(minFraction - (significand.length - (e + 1)), 0));
  return significand.slice(0, e + 1) + (significand.length > e + 1 ? "." + significand.slice(e + 1) : "");
}
// Something like Number#toPrecision: when value is between 10**-6 and 10**p? - to fixed, otherwise - to exponential:
function toPrecision(significand, exponent, minSignificant) {
  const e = exponent + BigInt(significand.length - 1);
  if (e < -6n || e >= BigInt(minSignificant)) {
    return bigDecimalToPlainString(significand, -(significand.length - 1), 0, minSignificant) + "e" + (e < 0n ? "-" : "+") + bigIntAbs(e).toString();
  }
  return bigDecimalToPlainString(significand, Number(exponent), 0, minSignificant);
}
function toFixed(significand, exponent, minFraction) {
  return bigDecimalToPlainString(significand, exponent, minFraction, 0);
}
function toExponential(significand, exponent, minFraction) {
  const e = exponent + BigInt(significand.length - 1);
  return bigDecimalToPlainString(significand, -(significand.length - 1), 0, minFraction + 1) + "e" + (e < 0n ? "-" : "+") + bigIntAbs(e).toString();
}

BigDecimal.prototype.toFixed = function (fractionDigits, roundingMode = "half-up") {
  const value = BigDecimal.multiply(this, BigDecimal.BigDecimal(10n**BigInt(fractionDigits)));
  const sign = BigDecimal.lessThan(value, BigDecimal.BigDecimal(0)) ? "-" : "";
  const rounded = BigDecimal.round(value, {maximumFractionDigits: 0, roundingMode: roundingMode});
  const a = abs(rounded);
  return sign + toFixed(BigDecimal.toBigInt(a).toString(), -fractionDigits, fractionDigits);
};

function getDecimalSignificantAndExponent(value, precision, roundingMode) {
  //TODO: fix performance, test
  const exponentiate = function (x, n) {
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
    return y == undefined ? BigDecimal.BigDecimal(1) : y;
  };
  const log10Approximate = function (x) {
    if (!BigDecimal.greaterThan(x, BigDecimal.BigDecimal(0))) {
      throw new RangeError();
    }
    if (BigDecimal.lessThan(x, BigDecimal.BigDecimal(1))) {
      return -log10Approximate(BigDecimal.divide(BigDecimal.BigDecimal(1), x, rounding));
    }
    const digits = getCountOfDigits(x);
    const v = BigInt(bitLength(digits) - Math.floor(Math.log2(Number.MAX_SAFE_INTEGER + 1)));
    const lg = BigInt(Math.floor(Number(digits >> v) / Math.log2(10) * Math.log2(BASE))) << v;
    /*const ten = BigDecimal.BigDecimal(10);
    let b = 1n;
    while (!BigDecimal.lessThan(x, exponentiate(ten, b))) {
      b *= 2n;
    }
    let e = 0n;
    while (b >= 1n) {
      const u = exponentiate(ten, b);
      if (!BigDecimal.lessThan(x, u)) {
        e += b;
        x = BigDecimal.divide(x, u, rounding);
      }
      b /= 2n;
    }
    return e;*/
    if (lg < 3n) {
      return lg;
    }
    return lg + log10Approximate(BigDecimal.divide(x, exponentiate(ten, lg), rounding));
  };
  const sign = BigDecimal.lessThan(value, BigDecimal.BigDecimal(0)) ? -1 : +1;
  const roundToInteger = function (a) {
    return BigDecimal.round(sign >= 0 ? a : BigDecimal.unaryMinus(a), {maximumFractionDigits: 0, roundingMode: roundingMode});
  };
  if (BigDecimal.equal(value, BigDecimal.BigDecimal(0))) {
    return {significand: "0", exponent: 0n};
  }
  const ten = BigDecimal.BigDecimal(10);
  let rounding = {maximumSignificantDigits: 8, roundingMode: "half-even"};
  let result = undefined;
  let fd = 0n;
  do {
    let x = abs(value);
    
    fd = 0n - log10Approximate(x);
    if (fd > 0n) {
      x = BigDecimal.multiply(x, exponentiate(ten, fd), rounding);
    } else if (fd < 0n) {
      x = BigDecimal.divide(x, exponentiate(ten, -fd), rounding);
    }
    if (!BigDecimal.lessThan(x, ten)) {
      fd -= 1n;
      x = BigDecimal.divide(x, ten, rounding);
    }
    if (BigDecimal.lessThan(x, BigDecimal.BigDecimal(1))) {
      fd += 1n;
      x = BigDecimal.multiply(x, ten, rounding);
    }
    if (!BigDecimal.lessThan(x, BigDecimal.BigDecimal(1)) && BigDecimal.lessThan(x, ten)) {
      fd -= 1n;
      fd += BigInt(precision);
      if (fd > 0n) {
        x = BigDecimal.multiply(value, exponentiate(ten, fd), rounding);
      } else if (fd < 0n) {
        x = BigDecimal.divide(value, exponentiate(ten, -fd), rounding);
      } else {
        x = value;
      }
      x = abs(x);
      //x = BigDecimal.multiply(x, exponentiate(ten, BigInt(precision - 1)), rounding);
      const error = BigDecimal.multiply(BigDecimal.multiply(BigDecimal.BigDecimal(bigIntAbs(fd) + BigInt(precision)), BigDecimal.divide(BigDecimal.BigDecimal(1), exponentiate(BigDecimal.BigDecimal(BASE), BigInt(rounding.maximumSignificantDigits)))), x);
      //TODO: ?
      if (rounding.maximumSignificantDigits > (Math.abs(Number(fd)) + precision) * Math.log2(10) + digits(value.significand) || BigDecimal.equal(roundToInteger(BigDecimal.add(x, error)), roundToInteger(BigDecimal.subtract(x, error)))) {
      result = BigDecimal.toBigInt(abs(roundToInteger(x))).toString();
      }
    }
    rounding = {maximumSignificantDigits: rounding.maximumSignificantDigits * 2, roundingMode: "half-even"};
  } while (result == undefined);
  return {significand: result, exponent: -fd};
}

BigDecimal.prototype.toPrecision = function (precision, roundingMode = "half-up") {
  const tmp = getDecimalSignificantAndExponent(this, precision, roundingMode);
  return (BigDecimal.lessThan(this, BigDecimal.BigDecimal(0)) ? "-" : "") + toPrecision(tmp.significand, tmp.exponent, precision);
};

BigDecimal.prototype.toExponential = function (fractionDigits, roundingMode = "half-up") {
  const tmp = getDecimalSignificantAndExponent(this, fractionDigits + 1, roundingMode);
  return (BigDecimal.lessThan(this, BigDecimal.BigDecimal(0)) ? "-" : "") + toExponential(tmp.significand, tmp.exponent, fractionDigits);
};

function exponentiate(a, n) {
  if (!BigDecimal.equal(a, BigDecimal.BigDecimal(BASE))) {
    throw new RangeError("a should be BASE");//?
  }
  if (n < 0n) {
    return BigDecimal.divide(BigDecimal.BigDecimal(1), exponentiate(a, -n));
  }
  console.assert(n >= 0n);
  let accumulator = BigDecimal.BigDecimal(1);
  let x = a;
  while (n > 0n) {
    if (n % 2n !== 0n) {
      accumulator = BigDecimal.multiply(accumulator, x);
      n -= 1n;
    } else {
      n /= 2n;
      x = BigDecimal.multiply(x, x);
    }
  }
  return accumulator;
}



function getCountOfDigits(a) { // floor(log(abs(a))/log(BASE)) + 1
  if (a.significand === 0n) {
    throw new RangeError();
  }
  return BigInt(digits(a.significand)) + BigInt(a.exponent);
}

function abs(a) {
  return BigDecimal.lessThan(a, BigDecimal.BigDecimal(0)) ? BigDecimal.unaryMinus(a) : a;
}

function sign(x) {
  return BigDecimal.lessThan(x, BigDecimal.BigDecimal(0)) ? BigDecimal.BigDecimal(-1) : (BigDecimal.greaterThan(x, BigDecimal.BigDecimal(0)) ? BigDecimal.BigDecimal(+1) : BigDecimal.BigDecimal(0));
}

function significandDigits(a) {
  let maximumSignificantDigits = 1;
  while (!BigDecimal.equal(BigDecimal.round(a, {maximumSignificantDigits: maximumSignificantDigits, roundingMode: "half-even"}), a)) {
    maximumSignificantDigits *= 2;
  }
  let from = maximumSignificantDigits / 2;
  let to = maximumSignificantDigits;
  while (to - 1 > from) {
    const middle = from + Math.floor((to - from) / 2);
    if (!BigDecimal.equal(BigDecimal.round(a, {maximumSignificantDigits: middle, roundingMode: "half-even"}), a)) {
      to = middle;
    } else {
      from = middle;
    }
  }
  return to;
}

function getExponent(number) {
  const e = Math.floor(Math.log(Math.abs(number)) / Math.log(2)) - 1;
  return Math.abs(number) / 2**e >= 2 ? e + 1 : e;
}



function tryToMakeCorrectlyRounded(specialValue, f, name) {
  function getExpectedResultIntegerDigits(x) {
    if (name === "exp") {
      // e**x <= BASE**k
      // k >= x / log(BASE)
      return Math.ceil(Number(BigDecimal.toBigInt(BigDecimal.round(x, {maximumFractionDigits: 0, roundingMode: "half-even"}))) / Math.log(BASE));
    }
    if (name === "log") {
      // log(x) <= BASE**k
      // log(log(x))/log(BASE) <= k
      return Math.ceil(Math.log2(Math.ceil(Math.max(Number(getCountOfDigits(x)), 1) * Math.log(BASE))) / Math.log2(BASE));
    }
    return 1;
  }
  // (?) https://en.wikipedia.org/wiki/Rounding#Table-maker's_dilemma
  return function (x, rounding) {
    if (BigDecimal.equal(x, BigDecimal.BigDecimal(specialValue))) {
      return f(x, rounding);
    }
    let result = BigDecimal.BigDecimal(0);
    let i = 0;
    let error = BigDecimal.BigDecimal(0);
    do {
      if (i > 4 * ((9 + 1) / BASE) && rounding.maximumSignificantDigits != null && rounding.roundingMode === "half-even" && name !== "sin" && name !== "cos") {
        throw new Error();
      }
      i += 1;
      const internalRounding = {
        maximumSignificantDigits: Math.ceil(Math.max(rounding.maximumSignificantDigits || (rounding.maximumFractionDigits + 1 + getExpectedResultIntegerDigits(x) - 1), significandDigits(x)) * Math.cbrt(2**(i - 1))) + 2 + (BASE === 2 ? 1 : 0),
        roundingMode: "half-even"
      };
      result = undefined;
      if (internalRounding.maximumSignificantDigits <= Math.log2((Number.MAX_SAFE_INTEGER + 1) / 4) / Math.log2(BASE) && significandDigits(x) < Math.log2(Number.MAX_SAFE_INTEGER + 1) && BASE === 2) {
        // Hm... https://www.gnu.org/software/libc/manual/html_node/Errors-in-Math-Functions.html
        const v = Number(x.significand) * BASE**Number(x.exponent);
        const numberValue = Math[name](v);
        if (name !== "sin" && name !== "cos" && name !== "tan" || Math.abs(numberValue) < Math.PI / 4) {
          const MIN_NORMALIZED_VALUE = (Number.MIN_VALUE * 1.25 > Number.MIN_VALUE ? Number.MIN_VALUE : Number.MIN_VALUE * (Number.MAX_SAFE_INTEGER + 1) / 2) || 2**-1022;
          const a = Math.abs(numberValue);
          if (a < 1/0 && a > MIN_NORMALIZED_VALUE) {
            const e = getExponent(a);
            const s = numberValue / 2**e;
            const e1 = getExponent(Number.MAX_SAFE_INTEGER + 1) - 1;
            result = create(BigInt(s * 2**e1), e - e1);//TODO: ?
          }
        }
      }
      if (result == undefined) {
        result = f(x, internalRounding);
      }
      // round(result - error) === round(result + error)
      error = BigDecimal.divide(abs(result), BigDecimal.BigDecimal(BIGINT_BASE**BigInt(internalRounding.maximumSignificantDigits)));
      //if (i > 0) {
        //console.log(i, f.name, x + "", result + "", error + "", BigDecimal.round(BigDecimal.subtract(result, error), rounding) + "", BigDecimal.round(BigDecimal.add(result, error), rounding) + "");
      //}
    } while (!BigDecimal.equal(BigDecimal.round(BigDecimal.subtract(result, error), rounding), BigDecimal.round(BigDecimal.add(result, error), rounding)));
    if (i > 1) {
      //console.debug(i, name);
    }
    return BigDecimal.round(result, rounding);
  };
}

function sqrt(x, rounding) {
  // from https://en.wikipedia.org/wiki/Square_root#Computation
  let lastResult = BigDecimal.add(x, BigDecimal.BigDecimal(1));
  let result = x;
  while (BigDecimal.lessThan(result, lastResult)) {
    lastResult = result;
    result = BigDecimal.divide(BigDecimal.add(BigDecimal.divide(x, result, rounding), result), BigDecimal.BigDecimal(2), rounding);
  }
  return result;
}

BigDecimal.log = tryToMakeCorrectlyRounded(1, function log(x, rounding) {
  if (!BigDecimal.greaterThan(x, BigDecimal.BigDecimal(0))) {
    throw new RangeError();
  }
  // https://ru.wikipedia.org/wiki/Логарифм#Разложение_в_ряд_и_вычисление_натурального_логарифма
  const internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log2(rounding.maximumSignificantDigits + 0.5) / Math.log2(BASE)),
    roundingMode: "half-even"
  };
  if (true) {
    //! ln(f * BASE**k) = ln(f) + k * ln(BASE), where (1/BASE) <= f <= BASE
    let k = getCountOfDigits(x) - 1n;
    let f = BigDecimal.divide(x, exponentiate(BigDecimal.BigDecimal(BASE), k));
    let ff = BigDecimal.round(BigDecimal.multiply(f, f), {maximumSignificantDigits: 3, roundingMode: "half-even"});
    if (BigDecimal.greaterThan(ff, BigDecimal.BigDecimal(BASE))) {
      k += 1n;
      f = BigDecimal.divide(f, BigDecimal.BigDecimal(BASE));
    }
    if (BigDecimal.lessThan(ff, BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.BigDecimal(BASE)))) {
      k -= 1n;
      f = BigDecimal.multiply(f, BigDecimal.BigDecimal(BASE));
    }
    if (k !== 0n) {
      return BigDecimal.add(BigDecimal.log(f, internalRounding), BigDecimal.multiply(BigDecimal.BigDecimal(2n * k), BigDecimal.log(sqrt(BigDecimal.BigDecimal(BASE), internalRounding), internalRounding)));
    }
  }
  //! log(x) = log((1 + g) / (1 - g)) = 2*(g + g**3/3 + g**5/5 + ...)
  const g = BigDecimal.divide(BigDecimal.subtract(x, BigDecimal.BigDecimal(1)), BigDecimal.add(x, BigDecimal.BigDecimal(1)), internalRounding);
  let n = 1;
  let term = BigDecimal.BigDecimal(1);
  let sum = term;
  let lastSum = BigDecimal.BigDecimal(0);
  const gg = BigDecimal.multiply(g, g, internalRounding);
  while (!BigDecimal.equal(lastSum, sum)) {
    n += 2;
    term = BigDecimal.multiply(term, BigDecimal.BigDecimal(n - 2));
    term = BigDecimal.multiply(term, gg);
    term = BigDecimal.divide(term, BigDecimal.BigDecimal(n), internalRounding);
    lastSum = sum;
    sum = BigDecimal.add(sum, term, internalRounding);
  }
  return BigDecimal.multiply(BigDecimal.multiply(BigDecimal.BigDecimal(2), g), sum);
}, "log");

BigDecimal.exp = tryToMakeCorrectlyRounded(0, function exp(x, rounding) {
  //! k = round(x / ln(BASE));
  //! exp(x) = exp(x - k * ln(BASE) + k * ln(BASE)) = exp(x - k * ln(BASE)) * BASE**k
  const internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log2(rounding.maximumSignificantDigits + 0.5) / Math.log2(BASE)),
    roundingMode: "half-even"
  };
  if (!BigDecimal.equal(x, BigDecimal.BigDecimal(0))) {
    const logBASEApproximate = BigDecimal.divide(BigDecimal.BigDecimal(Math.log(BASE) * (Number.MAX_SAFE_INTEGER + 1)), BigDecimal.BigDecimal(Number.MAX_SAFE_INTEGER + 1), internalRounding);
    const kApproximate = BigDecimal.round(BigDecimal.divide(x, logBASEApproximate, {maximumSignificantDigits: Math.max(Number(getCountOfDigits(x)), 1), roundingMode: "half-even"}), {maximumFractionDigits: 0, roundingMode: "half-even"});
    if (!BigDecimal.equal(kApproximate, BigDecimal.BigDecimal(0))) {
      const logBASE = BigDecimal.log(BigDecimal.BigDecimal(BASE), {maximumSignificantDigits: internalRounding.maximumSignificantDigits + Number(getCountOfDigits(kApproximate)), roundingMode: "half-even"});
      const k = BigDecimal.round(BigDecimal.divide(x, logBASE, {maximumSignificantDigits: Math.max(Number(getCountOfDigits(x)), 1), roundingMode: "half-even"}), {maximumFractionDigits: 0, roundingMode: "half-even"});
      const r = BigDecimal.subtract(x, BigDecimal.multiply(k, logBASE));
      return BigDecimal.multiply(BigDecimal.exp(r, internalRounding), exponentiate(BigDecimal.BigDecimal(BASE), BigDecimal.toBigInt(k)));
    }
  }
  // https://en.wikipedia.org/wiki/Exponential_function#Computation
  let n = 0;
  let term = BigDecimal.BigDecimal(1);
  let sum = term;
  let lastSum = BigDecimal.BigDecimal(0);
  while (!BigDecimal.equal(lastSum, sum)) {
    n += 1;
    term = BigDecimal.multiply(term, x);
    term = BigDecimal.divide(term, BigDecimal.BigDecimal(n), internalRounding);
    lastSum = sum;
    sum = BigDecimal.add(sum, term, internalRounding);
  }
  return sum;
}, "exp");

function divideByHalfOfPI(x, rounding) { // x = k*pi/2 + r + 2*pi*n, where |r| < pi/4
  if (BigDecimal.lessThan(x, BigDecimal.BigDecimal(0))) {
    throw new RangeError();
  }
  if (BigDecimal.greaterThan(x, BigDecimal.divide(BigDecimal.BigDecimal(Math.floor(Math.PI / 4 * (Number.MAX_SAFE_INTEGER + 1) + 0.5)), BigDecimal.BigDecimal(Number.MAX_SAFE_INTEGER + 1), rounding))) {
    const halfOfPi = BigDecimal.multiply(BigDecimal.BigDecimal(2), BigDecimal.atan(BigDecimal.BigDecimal(1), {maximumSignificantDigits: rounding.maximumSignificantDigits + Number(getCountOfDigits(x)) + 1, roundingMode: "half-even"}));
    const i = BigDecimal.round(BigDecimal.divide(x, halfOfPi, {maximumSignificantDigits: Math.max(Number(getCountOfDigits(x)), 1), roundingMode: "half-even"}), {maximumFractionDigits: 0, roundingMode: "half-even"});
    const remainder = BigDecimal.subtract(x, BigDecimal.multiply(i, halfOfPi));
    return {remainder: remainder, k: (Number(BigDecimal.toBigInt(i) % 4n) + 4) % 4};
  }
  return {remainder: x, k: 0};
}

BigDecimal.sin = tryToMakeCorrectlyRounded(0, function (x, rounding) {
  if (BigDecimal.lessThan(x, BigDecimal.BigDecimal(0))) {
    return BigDecimal.unaryMinus(BigDecimal.sin(BigDecimal.unaryMinus(x), rounding));
  }
  const tmp = divideByHalfOfPI(x, rounding);
  const a = tmp.remainder;
  const k = tmp.k;
  if (k === 1) {
    return BigDecimal.cos(a, rounding);
  }
  if (k === 2) {
    return BigDecimal.unaryMinus(BigDecimal.sin(a, rounding));
  }
  if (k === 3) {
    return BigDecimal.unaryMinus(BigDecimal.cos(a, rounding));
  }
  // https://en.wikipedia.org/wiki/Lookup_table#Computing_sines
  const internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log2(rounding.maximumSignificantDigits + 0.5) / Math.log2(BASE)),
    roundingMode: "half-even"
  };
  let n = 1;
  let term = BigDecimal.BigDecimal(1);
  let sum = term;
  let lastSum = BigDecimal.BigDecimal(0);
  while (!BigDecimal.equal(lastSum, sum)) {
    n += 2;
    term = BigDecimal.multiply(term, BigDecimal.multiply(a, a));
    term = BigDecimal.divide(term, BigDecimal.BigDecimal(-n * (n - 1)), internalRounding);
    lastSum = sum;
    sum = BigDecimal.add(sum, term, internalRounding);
  }
  return BigDecimal.multiply(a, sum);
}, "sin");

BigDecimal.cos = tryToMakeCorrectlyRounded(0, function (x, rounding) {
  if (BigDecimal.lessThan(x, BigDecimal.BigDecimal(0))) {
    return BigDecimal.cos(BigDecimal.unaryMinus(x), rounding);
  }
  const tmp = divideByHalfOfPI(x, rounding);
  const a = tmp.remainder;
  const k = tmp.k;
  if (k === 1) {
    return BigDecimal.unaryMinus(BigDecimal.sin(a, rounding));
  }
  if (k === 2) {
    return BigDecimal.unaryMinus(BigDecimal.cos(a, rounding));
  }
  if (k === 3) {
    return BigDecimal.sin(a, rounding);
  }
  // https://en.wikipedia.org/wiki/Trigonometric_functions#Power_series_expansion
  const internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log2(rounding.maximumSignificantDigits + 0.5) / Math.log2(BASE)),
    roundingMode: "half-even"
  };
  let n = 0;
  let term = BigDecimal.BigDecimal(1);
  let sum = term;
  let lastSum = BigDecimal.BigDecimal(0);
  while (!BigDecimal.equal(lastSum, sum)) {
    n += 2;
    term = BigDecimal.multiply(term, BigDecimal.multiply(a, a));
    term = BigDecimal.divide(term, BigDecimal.BigDecimal(-n * (n - 1)), internalRounding);
    lastSum = sum;
    sum = BigDecimal.add(sum, term, internalRounding);
  }
  return sum;
}, "cos");

BigDecimal.atan = tryToMakeCorrectlyRounded(0, function (x, rounding) {
  if (BigDecimal.greaterThan(abs(x), BigDecimal.BigDecimal(1))) {
    const halfOfPi = BigDecimal.multiply(BigDecimal.atan(BigDecimal.BigDecimal(1), rounding), BigDecimal.BigDecimal(2));
    return BigDecimal.multiply(sign(x), BigDecimal.subtract(halfOfPi, BigDecimal.atan(BigDecimal.divide(BigDecimal.BigDecimal(1), abs(x), rounding), rounding)));
  }
  // https://en.wikipedia.org/wiki/Inverse_trigonometric_functions#:~:text=Alternatively,%20this%20can%20be%20expressed%20as
  const internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log2(rounding.maximumSignificantDigits + 0.5) / Math.log2(BASE)),
    roundingMode: "half-even"
  };
  let n = 0;
  let term = BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.add(BigDecimal.BigDecimal(1), BigDecimal.multiply(x, x)), internalRounding);
  let sum = term;
  let lastSum = BigDecimal.BigDecimal(0);
  while (!BigDecimal.equal(lastSum, sum)) {
    n += 1;
    term = BigDecimal.multiply(term, BigDecimal.BigDecimal(2 * n));
    term = BigDecimal.divide(term, BigDecimal.BigDecimal(2 * n + 1), internalRounding);
    term = BigDecimal.multiply(term, BigDecimal.multiply(x, x));
    term = BigDecimal.divide(term, BigDecimal.add(BigDecimal.BigDecimal(1), BigDecimal.multiply(x, x)), internalRounding);
    lastSum = sum;
    sum = BigDecimal.add(sum, term, internalRounding);
  }
  return BigDecimal.multiply(x, sum);
}, "atan");

  return BigDecimal;
};

const BigDecimal = factory(10);
const BigFloat = factory(2);

export {BigDecimal, BigFloat}
