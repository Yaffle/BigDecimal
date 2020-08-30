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
// Math: (not in the spec)
// BigDecimal.log(a, rounding)
// BigDecimal.exp(a, rounding)
// BigDecimal.sin(a, rounding)
// BigDecimal.cos(a, rounding)
// BigDecimal.atan(a, rounding)

function BigDecimal(significand, exponent) {
  this.significand = significand;
  this.exponent = exponent;
}
BigDecimal.BigDecimal = function (value) {
  if (value instanceof BigDecimal) {
    return value;
  }
  if (typeof value === "string") {
    //throw new TypeError();
    var match = /^\s*([+\-])?(\d+)?\.?(\d+)?(?:e([+\-]?\d+))?\s*$/.exec(value);
    if (match == null) {
      throw new RangeError();
    }
    return create(BigInt((match[1] || "") + (match[2] || "") + (match[3] || "")), BigInt(match[4] || "0") - BigInt((match[3] || "").length));
  }
  var a = create(BigInt(value), 0n);
  var b = normalize(a);
  while (a !== b) {
    a = b;
    b = normalize(a);
  }
  return a;
};
BigDecimal.toNumber = function (a) {
  return Number(BigDecimal.toBigInt(a));
};
BigDecimal.toBigInt = function (a) {
  if (a.exponent < 0n && a.significand % 10n**(-a.exponent) !== 0n) {
    throw new RangeError("The bigdecimal " + a.toString() + " cannot be converted to a BigInt because it is not an integer");
  }
  return a.exponent < 0n ? a.significand / 10n**(-a.exponent) : a.significand * 10n**a.exponent;
};
function create(significand, exponent) {
  return new BigDecimal(significand, exponent);
}
function bigIntMax(a, b) {
  return a < b ? b : a;
}
function bigIntMin(a, b) {
  return a < b ? a : b;
}
function bigIntSign(a) {
  return a < 0n ? -1n : (a > 0n ? 1n : 0n);
}
function bigIntAbs(a) {
  return a < 0n ? -a : a;
}
function naturalLogarithm(n) {
  var number = Number(n);
  if (number < 1 / 0) {
    return Math.log(number);
  }
  // https://github.com/tc39/proposal-bigint/issues/205
  var s = n.toString(16);
  var p = Math.floor(Math.log((Number.MAX_SAFE_INTEGER + 1) / 32 + 0.5) / Math.log(2));
  var l = Math.floor(p / 4);
  return Math.log(Number("0x" + s.slice(0, l)) / Math.pow(2, 4 * l)) + 4 * Math.log(2) * s.length;
}
function digits(a) { // floor(log10(abs(a.significand))) + 1
  var n = bigIntMax(bigIntAbs(a.significand), 1n);
  var number = Number(n);
  if (number < (9007199254740991 + 1) / 16) {
    return Math.floor(Math.log(number + 0.5) / Math.log(10)) + 1;
  }
  if (number < 1 / 0) {
    var e = Math.log(number) / Math.log(10);
    if (Math.floor(e * (1 + 2 / (9007199254740991 + 1))) < e) {
      return Math.floor(e) + 1;
    }
    var i = Math.floor(e + 0.5);
    return n >= 10n**BigInt(i) ? i + 1 : i;
  }
  var e = naturalLogarithm(n) / Math.log(10);
  if (Math.floor(e * (1 - 32 / (9007199254740991 + 1))) === Math.floor(e) &&
      Math.floor(e * (1 + 32 / (9007199254740991 + 1))) === Math.floor(e)) {
    return Math.floor(e) + 1;
  }
  var i = Math.floor(e + 0.5);
  return n >= 10n**BigInt(i) ? i + 1 : i;
}
function normalize(a) {
  if (bigIntAbs(a.significand) >= 67108864n) { // Math.sqrt((Number.MAX_SAFE_INTEGER + 1) / 2)
    var dividend = a.significand;
    var divisor = BigInt(Math.pow(10, 15));
    var e = 15;
    if (dividend % divisor === 0n) {
      while (dividend % (divisor * divisor) === 0n) {
        divisor *= divisor;
        e *= 2;
      }
      var quotient = dividend / divisor;
      return create(quotient, a.exponent + BigInt(e));
    }
  }
  if (a.significand === 0n && a.exponent !== 0n) {
    return create(0n, 0n);
  }
  return a;
}
function round(a, d, r, rounding) {
  if (rounding != null) {
    var k = 0n;
    if (rounding.maximumSignificantDigits != null) {
      console.assert(rounding.maximumSignificantDigits > 0);
      k = bigIntMax(BigInt(digits(a) - rounding.maximumSignificantDigits), 0n);
    }
    if (rounding.maximumFractionDigits != null) {
      console.assert(rounding.maximumFractionDigits >= 0);
      k = bigIntMax(0n - (a.exponent + BigInt(rounding.maximumFractionDigits)), 0n);
    }
    if (k > 0n || r !== 0n) {
      var divisor = 10n**k;
      var dividend = a.significand;
      var quotient = dividend / divisor;
      var remainder = dividend - quotient * divisor;
      divisor = divisor * d;
      remainder = remainder * d + r;
      if (remainder !== 0n) {
        if (rounding.roundingMode === "floor") {
          if (remainder < 0n) {
            quotient -= 1n;
          }
        } else if (rounding.roundingMode === "ceil") {
          if (remainder > 0n) {
            quotient += 1n;
          }
        } else if (rounding.roundingMode === "half-up") {
          if (remainder * 2n >= divisor) {
            quotient += 1n;
          }
          if (-remainder * 2n >= divisor) {
            quotient -= 1n;
          }
        } else if (rounding.roundingMode === "half-down") {
          if (remainder * 2n > divisor) {
            quotient += 1n;
          }
          if (-remainder * 2n > divisor) {
            quotient -= 1n;
          }
        } else if (rounding.roundingMode === "half-even") {
          if (remainder * 2n > divisor || (remainder * 2n === divisor && quotient % 2n !== 0n)) {
            quotient += 1n;
          }
          if (-remainder * 2n > divisor || (-remainder * 2n === divisor && quotient % 2n !== 0n)) {
            quotient -= 1n;
          }
        } else {
          throw new RangeError("supported roundingMode (floor/ceil/half-even/half-up/half-down) is not given");
        }
      }
      return create(quotient, a.exponent + k);
    }
  }
  if (r !== 0n) {
    throw new RangeError("rounding is not given for inexact operation");
  }
  return a;
}
BigDecimal.unaryMinus = function (a) {
  return create(-a.significand, a.exponent);
};
BigDecimal.add = function (a, b, rounding = null) {
  if (b.significand === 0n) {
    return round(a, 1n, 0n, rounding);
  }
  if (a.significand === 0n) {
    return round(b, 1n, 0n, rounding);
  }
  if (rounding != null && rounding.maximumSignificantDigits != null && a.exponent - b.exponent > BigInt(digits(b) + (rounding.maximumSignificantDigits + 1))) {
    b = create(bigIntSign(b.significand), a.exponent - BigInt(rounding.maximumSignificantDigits + 1));
  }
  if (rounding != null && rounding.maximumSignificantDigits != null && b.exponent - a.exponent > BigInt(digits(a) + (rounding.maximumSignificantDigits + 1))) {
    a = create(bigIntSign(a.significand), b.exponent - BigInt(rounding.maximumSignificantDigits + 1));
  }
  var exponent = bigIntMax(a.exponent, b.exponent);
  return round(create(a.significand * 10n**(exponent - b.exponent) + b.significand * 10n**(exponent - a.exponent), bigIntMin(a.exponent, b.exponent)), 1n, 0n, rounding);
};
BigDecimal.subtract = function (a, b, rounding = null) {
  return BigDecimal.add(a, BigDecimal.unaryMinus(b), rounding);
};
BigDecimal.multiply = function (a, b, rounding = null) {
  return normalize(round(create(a.significand * b.significand, a.exponent + b.exponent), 1n, 0n, rounding));
};
BigDecimal.divide = function (a, b, rounding) {
  if (a.significand === 0n) {
    return a;
  }
  var exponent = a.exponent - b.exponent;
  var scaling = 0n;
  if (rounding != null && rounding.maximumSignificantDigits != null) {
    scaling = BigInt(rounding.maximumSignificantDigits + digits(b) - digits(a));
  } else if (rounding != null && rounding.maximumFractionDigits != null) {
    //scaling = BigInt(rounding.maximumFractionDigits) + bigIntMax(a.exponent, 0n) + bigIntMax(0n - b.exponent, 0n) - bigIntMin(a.exponent - b.exponent + BigInt(digits(a) - digits(b)), 0n);
    scaling = BigInt(rounding.maximumFractionDigits) + exponent;
  } else {
    // Try to do exact division:
    scaling = BigInt(Math.ceil(digits(b) / (Math.log(2) / Math.log(10)) + 1));
  }
  var dividend = a.significand * (scaling > 0n ? 10n**scaling : 1n);
  var divisor = b.significand * (scaling < 0n ? 10n**(-scaling) : 1n);
  var quotient = dividend / divisor;
  var remainder = dividend - quotient * divisor;
  return round(create(quotient, exponent - scaling), divisor < 0n ? -divisor : divisor, divisor < 0n ? -remainder : remainder, rounding);
};
function compare(a, b) {
  if (a.significand <= 0n && b.significand >= 0n) {
    return !(a.significand === 0n && b.significand === 0n) ? -1 : 0;
  }
  if (a.significand >= 0n && b.significand <= 0n) {
    return (a.significand === 0n && b.significand === 0n) ? 0 : +1;
  }
  var differenceOfLogarithms = a.exponent - b.exponent + BigInt(digits(a) - digits(b));
  if (differenceOfLogarithms !== 0n) {
    return a.significand < 0n && b.significand < 0n ? (differenceOfLogarithms > 0n ? -1 : +1) : (differenceOfLogarithms < 0n ? -1 : +1);
  }
  var exponent = bigIntMax(a.exponent, b.exponent);
  var difference = a.significand * 10n**(exponent - b.exponent) - b.significand * 10n**(exponent - a.exponent);
  return difference < 0n ? -1 : (difference > 0n ? +1 : 0);
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
  return round(a, 1n, 0n, rounding);
};

BigDecimal.prototype.toString = function () {
  //! https://tc39.es/ecma262/#sec-number.prototype.tostring
  if (arguments.length !== 0) {
    throw new RangeError("not implemented");
  }
  var x = BigDecimal.BigDecimal(this);
  //! https://tc39.es/ecma262/#sec-numeric-types-number-tostring
  if (BigDecimal.equal(x, BigDecimal.BigDecimal(0))) {
    return "0";
  }
  var sign = "";
  if (BigDecimal.lessThan(x, BigDecimal.BigDecimal(0))) {
    x = BigDecimal.unaryMinus(x);
    sign = "-";
  }
  var getSignificand = function (a, log10) {
    var s = BigDecimal.divide(a, exponentiate(BigDecimal.BigDecimal(10), log10));
    var m = BigDecimal.BigDecimal(Math.pow(10, 15));
    while (!BigDecimal.equal(BigDecimal.round(BigDecimal.multiply(s, m), {maximumFractionDigits: 0, roundingMode: "half-even"}), BigDecimal.multiply(s, m))) {
      m = BigDecimal.multiply(m, m);
    }
    return BigDecimal.toBigInt(BigDecimal.multiply(s, m)).toString().replace(/0+$/g, "") || "0";
  };
  var e = getCountOfDigits(x);
  var significand = getSignificand(x, e);
  if (!BigDecimal.greaterThan(BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.BigDecimal(10n**6n)), x) &&
      BigDecimal.lessThan(x, BigDecimal.BigDecimal(10n**21n))) {
    e = Number(e);
    var zeros = Math.max(0, e - significand.length);
    if (e <= 0) {
      significand = "0".repeat(1 - e) + significand;
      e = 1;
    }
    significand += "0".repeat(zeros);
    return sign + significand.slice(0, e) + (significand.length > e ? "." + significand.slice(e) : "");
  }
  return sign + (significand.length === 1 ? significand : significand.slice(0, 1) + "." + significand.slice(1)) + "e" + (e - 1n >= 0n ? "+" : "") + (e - 1n).toString();
};

function exponentiate(a, n) {
  if (n < 0n) {
    return BigDecimal.divide(BigDecimal.BigDecimal(1), exponentiate(a, -n));
  }
  console.assert(n >= 0n);
  var accumulator = BigDecimal.BigDecimal(1);
  var x = a;
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

function getCountOfDigits(a) { // floor(log10(abs(a))) + 1
  if (a.significand === 0n) {
    throw new RangeError();
  }
  return BigInt(digits(a)) + a.exponent;
}

function abs(a) {
  return BigDecimal.lessThan(a, BigDecimal.BigDecimal(0)) ? BigDecimal.unaryMinus(a) : a;
}

function sign(x) {
  return BigDecimal.lessThan(x, BigDecimal.BigDecimal(0)) ? BigDecimal.BigDecimal(-1) : (BigDecimal.greaterThan(x, BigDecimal.BigDecimal(0)) ? BigDecimal.BigDecimal(+1) : BigDecimal.BigDecimal(0));
}

function significandDigits(a) {
  var maximumSignificantDigits = 1;
  while (!BigDecimal.equal(BigDecimal.round(a, {maximumSignificantDigits: maximumSignificantDigits, roundingMode: "half-even"}), a)) {
    maximumSignificantDigits *= 2;
  }
  return maximumSignificantDigits;
}

function tryToMakeCorrectlyRounded(specialValue, f, name) {
  function getExpectedResultIntegerDigits(x) {
    if (name === "exp") {
      // e**x <= 10**k
      // k >= x / log(10)
      return Math.ceil(Number(BigDecimal.toBigInt(BigDecimal.round(x, {maximumFractionDigits: 0, roundingMode: "half-even"}))) / Math.log(10));
    }
    if (name === "log") {
      // log(x) <= 10**k
      // log10(log10(x)*log(10)) <= k
      return Math.ceil(Math.log(Math.ceil(Math.max(Number(getCountOfDigits(x)), 1) * Math.log(10))) / Math.log(10));
    }
    return 1;
  }
  // (?) https://en.wikipedia.org/wiki/Rounding#Table-maker's_dilemma
  return function (x, rounding) {
    if (BigDecimal.equal(x, BigDecimal.BigDecimal(specialValue))) {
      return f(x, rounding);
    }
    var result = BigDecimal.BigDecimal(0);
    var i = 0;
    var error = BigDecimal.BigDecimal(0);
    do {
      if (i > 4 && rounding.maximumSignificantDigits != null && rounding.roundingMode === "half-even" && name !== "sin" && name !== "cos") {
        throw new Error();
      }
      i += 1;
      var internalRounding = {
        maximumSignificantDigits: Math.ceil(Math.max(rounding.maximumSignificantDigits || (rounding.maximumFractionDigits + 1 + getExpectedResultIntegerDigits(x) - 1), significandDigits(x)) * Math.cbrt(Math.pow(2, i - 1))) + 2,
        roundingMode: "half-even"
      };
      result = f(x, internalRounding);
      // round(result - error) === round(result + error)
      error = BigDecimal.divide(abs(result), BigDecimal.BigDecimal(10n**BigInt(internalRounding.maximumSignificantDigits)));
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
  var lastResult = x;
  var result = BigDecimal.divide(x, BigDecimal.BigDecimal(2));
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
  var internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log(rounding.maximumSignificantDigits + 0.5) / Math.log(10)),
    roundingMode: "half-even"
  };
  if (true) {
    //! ln(f * 10**k) = ln(f) + k * ln(10), where 0.1 <= f <= 10
    var k = getCountOfDigits(x) - 1n;
    var f = BigDecimal.divide(x, exponentiate(BigDecimal.BigDecimal(10), k));
    var ff = BigDecimal.round(BigDecimal.multiply(f, f), {maximumSignificantDigits: 3, roundingMode: "half-even"});
    if (BigDecimal.greaterThan(ff, BigDecimal.BigDecimal(10))) {
      k += 1n;
      f = BigDecimal.divide(f, BigDecimal.BigDecimal(10));
    }
    if (BigDecimal.lessThan(ff, BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.BigDecimal(10)))) {
      k -= 1n;
      f = BigDecimal.multiply(f, BigDecimal.BigDecimal(10));
    }
    if (k !== 0n) {
      return BigDecimal.add(BigDecimal.log(f, internalRounding), BigDecimal.multiply(BigDecimal.BigDecimal(2n * k), BigDecimal.log(sqrt(BigDecimal.BigDecimal(10), internalRounding), internalRounding)));
    }
  }
  //! log(x) = log((1 + g) / (1 - g)) = 2*(g + g**3/3 + g**5/5 + ...)
  var g = BigDecimal.divide(BigDecimal.subtract(x, BigDecimal.BigDecimal(1)), BigDecimal.add(x, BigDecimal.BigDecimal(1)), internalRounding);
  var n = 1;
  var term = BigDecimal.BigDecimal(1);
  var sum = term;
  var lastSum = BigDecimal.BigDecimal(0);
  var gg = BigDecimal.multiply(g, g, internalRounding);
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
  //! k = round(x / ln(10));
  //! exp(x) = exp(x - k * ln(10) + k * ln(10)) = exp(x - k * ln(10)) * 10**k
  var k = BigDecimal.divide(x, BigDecimal.divide(BigDecimal.BigDecimal(2302585092994046), BigDecimal.BigDecimal(1000000000000000)), {maximumFractionDigits: 0, roundingMode: "half-even"});
  var internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log(rounding.maximumSignificantDigits + 0.5) / Math.log(10)),
    roundingMode: "half-even"
  };
  if (!BigDecimal.equal(k, BigDecimal.BigDecimal(0))) {
    var log10 = BigDecimal.log(BigDecimal.BigDecimal(10), {maximumSignificantDigits: internalRounding.maximumSignificantDigits + Number(getCountOfDigits(k)), roundingMode: "half-even"});
    k = BigDecimal.divide(x, log10, {maximumFractionDigits: 0, roundingMode: "half-even"});
    var r = BigDecimal.subtract(x, BigDecimal.multiply(k, log10));
    return BigDecimal.multiply(BigDecimal.exp(r, internalRounding), exponentiate(BigDecimal.BigDecimal(10), BigDecimal.toBigInt(k)));
  }
  // https://en.wikipedia.org/wiki/Exponential_function#Computation
  var n = 0;
  var term = BigDecimal.BigDecimal(1);
  var sum = term;
  var lastSum = BigDecimal.BigDecimal(0);
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
  if (BigDecimal.greaterThan(x, BigDecimal.divide(BigDecimal.BigDecimal(785398163397448), BigDecimal.BigDecimal(1000000000000000)))) {
    var halfOfPi = BigDecimal.multiply(BigDecimal.BigDecimal(2), BigDecimal.atan(BigDecimal.BigDecimal(1), {maximumSignificantDigits: rounding.maximumSignificantDigits + Number(getCountOfDigits(x)) + 1, roundingMode: "half-even"}));
    var i = BigDecimal.divide(x, halfOfPi, {maximumFractionDigits: 0, roundingMode: "half-even"});
    var remainder = BigDecimal.subtract(x, BigDecimal.multiply(i, halfOfPi));
    return {remainder: remainder, k: (Number(BigDecimal.toBigInt(i) % 4n) + 4) % 4};
  }
  return {remainder: x, k: 0};
}

BigDecimal.sin = tryToMakeCorrectlyRounded(0, function (x, rounding) {
  if (BigDecimal.lessThan(x, BigDecimal.BigDecimal(0))) {
    return BigDecimal.unaryMinus(BigDecimal.sin(BigDecimal.unaryMinus(x), rounding));
  }
  var tmp = divideByHalfOfPI(x, rounding);
  var a = tmp.remainder;
  var k = tmp.k;
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
  var internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log(rounding.maximumSignificantDigits + 0.5) / Math.log(10)),
    roundingMode: "half-even"
  };
  var n = 1;
  var term = BigDecimal.BigDecimal(1);
  var sum = term;
  var lastSum = BigDecimal.BigDecimal(0);
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
  var tmp = divideByHalfOfPI(x, rounding);
  var a = tmp.remainder;
  var k = tmp.k;
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
  var internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log(rounding.maximumSignificantDigits + 0.5) / Math.log(10)),
    roundingMode: "half-even"
  };
  var n = 0;
  var term = BigDecimal.BigDecimal(1);
  var sum = term;
  var lastSum = BigDecimal.BigDecimal(0);
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
    var halfOfPi = BigDecimal.multiply(BigDecimal.atan(BigDecimal.BigDecimal(1), rounding), BigDecimal.BigDecimal(2));
    return BigDecimal.multiply(sign(x), BigDecimal.subtract(halfOfPi, BigDecimal.atan(BigDecimal.divide(BigDecimal.BigDecimal(1), abs(x), rounding), rounding)));
  }
  // https://en.wikipedia.org/wiki/Inverse_trigonometric_functions#:~:text=Alternatively,%20this%20can%20be%20expressed%20as
  var internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log(rounding.maximumSignificantDigits + 0.5) / Math.log(10)),
    roundingMode: "half-even"
  };
  var n = 0;
  var term = BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.add(BigDecimal.BigDecimal(1), BigDecimal.multiply(x, x)), internalRounding);
  var sum = term;
  var lastSum = BigDecimal.BigDecimal(0);
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

export default BigDecimal;
