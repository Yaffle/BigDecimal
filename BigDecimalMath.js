/*jshint esversion:11*/

// Math: (not in the spec)
// BigDecimal.log(a, rounding)
// BigDecimal.exp(a, rounding)
// BigDecimal.sin(a, rounding)
// BigDecimal.cos(a, rounding)
// BigDecimal.atan(a, rounding)
// BigDecimal.sqrt(a, rounding)

// "simple" Math functions:
// BigDecimal.abs(a)
// BigDecimal.sign(a)
// BigDecimal.max(a, b)
// BigDecimal.min(a, b)

function addMath(BigDecimal, BASE) {

  const BASE_LOG2_INV = 1 / Math.log2(BASE);
  const BIGINT_BASE = BigInt(BASE);

function convert(x) {
  return BigDecimal(x);
}

  //TODO: REMOVE(?)
  const exponentiate = function (x, n) {
    if (n < 0n) {
      return BigDecimal.divide(convert(1), exponentiate(x, -BigInt(n)));
    }
    let y = undefined;
    while (n >= 1n) {
      if (n % 2n === 0n) {
        x = BigDecimal.multiply(x, x);
        n /= 2n;
      } else {
        y = y == undefined ? x : BigDecimal.multiply(x, y);
        n -= 1n;
      }
    }
    return y == undefined ? convert(1) : y;
  };

function exponentiateBase(n) {
  //TODO: !?
  //return create(1n, n);
  return exponentiate(convert(BASE), BigInt(n));
}

function bigIntAbs(a) {
  return a < 0n ? 0n - a : a;
}

  const NumberSafeBits = Math.floor(Math.log2(Number.MAX_SAFE_INTEGER + 1));

function bitLength(a) {
  const s = a.toString(16);
  const c = +s.charCodeAt(0) - "0".charCodeAt(0);
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

//TODO: REMOVE(?)
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

function getCountOfDigits(a) { // floor(log(abs(a))/log(BASE)) + 1
  if (a.significand === 0n) {
    throw new RangeError();
  }
  return BigInt(digits(a.significand)) + BigInt(a.exponent);
}

const zero = BigDecimal(0);
BigDecimal.abs = function (a) {
  return BigDecimal.cmp(a, zero) < 0 ? BigDecimal.unaryMinus(a) : a;
};
BigDecimal.sign = function (a) {
  return BigDecimal.cmp(a, zero) < 0 ? -1 : (BigDecimal.cmp(a, zero) > 0 ? +1 : 0);
};
BigDecimal.max = function (a, b) {
  if (arguments.length > 2) {
    throw new RangeError("not implemented");
  }
  return BigDecimal.cmp(a, b) < 0 ? b : a;
};
BigDecimal.min = function (a, b) {
  if (arguments.length > 2) {
    throw new RangeError("not implemented");
  }
  return BigDecimal.cmp(a, b) > 0 ? b : a;
};

function significandDigits(a) {
  let maximumSignificantDigits = 1;
  while (BigDecimal.cmp(BigDecimal.round(a, {maximumSignificantDigits: maximumSignificantDigits, roundingMode: "half-even"}), a) !== 0) {
    maximumSignificantDigits *= 2;
  }
  let from = maximumSignificantDigits / 2;
  let to = maximumSignificantDigits;
  while (to - 1 > from) {
    const middle = from + Math.floor((to - from) / 2);
    if (BigDecimal.cmp(BigDecimal.round(a, {maximumSignificantDigits: middle, roundingMode: "half-even"}), a) !== 0) {
      from = middle;
    } else {
      to = middle;
    }
  }
  return to;
}




function tryToMakeCorrectlyRounded(specialValue, f, name) {
  function getExpectedResultIntegerDigits(x) {
    if (name === "exp") {
      // e**x <= BASE**k
      // k >= x / log(BASE)
      return Math.ceil(Number(BigInt(toBigInt(BigDecimal.round(x, {maximumFractionDigits: 0, roundingMode: "half-even"})))) / Math.log(BASE));
    }
    if (name === "log") {
      // log(x) <= BASE**k
      // log(log(x))/log(BASE) <= k
      return Math.ceil(Math.log2(Math.ceil(Math.max(Number(getCountOfDigits(x)), 1) * Math.log(BASE))) * BASE_LOG2_INV);
    }
    return 1;
  }
  // (?) https://en.wikipedia.org/wiki/Rounding#Table-maker's_dilemma
  return function (x, rounding) {
    if (BigDecimal.cmp(x, convert(specialValue)) === 0) {
      return f(x, {maximumSignificantDigits: 1, roundingMode: "half-even"});
    }
    let result = convert(0);
    let i = 0;
    let error = convert(0);
    do {
      if (i > 4 * ((9 + 1) / BASE) && rounding.maximumSignificantDigits != null && rounding.roundingMode === "half-even" && name !== "sin" && name !== "cos") {
        console.error(x, rounding);
        throw new Error();
      }
      i += 1;
      const internalRounding = {
        maximumSignificantDigits: Math.ceil(Math.max(rounding.maximumSignificantDigits || (rounding.maximumFractionDigits + 1 + getExpectedResultIntegerDigits(x) - 1), significandDigits(x)) * Math.pow(2, Math.ceil((i - 1) / 3))) + 2 + (BASE === 2 ? 1 : 0),
        roundingMode: "half-even"
      };
      result = undefined;
      if (BASE === 2 && Math.max(internalRounding.maximumSignificantDigits + 2, significandDigits(x) + 1) <= Math.log2(Number.MAX_SAFE_INTEGER + 1)) {
        // Hm... https://www.gnu.org/software/libc/manual/html_node/Errors-in-Math-Functions.html
        const e = x.exponent;
        const exponent = typeof e === 'number' ? e : Number(BigInt(e));
        const v = Number(BigInt(x.significand)) * BASE**exponent;
        // some browsers have inaccurate results for Math.sin, Math.cos, Math.tan outside of [-pi/4;pi/4] range
        if ((name !== "sin" && name !== "cos" && name !== "tan") || Math.abs(v) <= Math.PI / 4) {
          const numberValue = Math[name](v);
          const MIN_NORMALIZED_VALUE = (Number.MIN_VALUE * 1.25 > Number.MIN_VALUE ? Number.MIN_VALUE : Number.MIN_VALUE * (Number.MAX_SAFE_INTEGER + 1) / 2) || 2**-1022;
          const a = Math.abs(numberValue);
          if (a < 1/0 && a > MIN_NORMALIZED_VALUE) {
            result = convert(numberValue);
          }
        }
      }
      if (result == undefined) {
        result = f(x, internalRounding);
      }
      // round(result - error) === round(result + error)
      error = BigDecimal.multiply(exponentiateBase(-BigInt(internalRounding.maximumSignificantDigits)), BigDecimal.abs(result));
      //if (i > 0) {
        //console.log(i, f.name, x + "", result + "", error + "", BigDecimal.round(BigDecimal.subtract(result, error), rounding) + "", BigDecimal.round(BigDecimal.add(result, error), rounding) + "");
      //}
    } while (BigDecimal.cmp(BigDecimal.round(BigDecimal.subtract(result, error), rounding), BigDecimal.round(BigDecimal.add(result, error), rounding)) !== 0);
    if (i > 1) {
      //console.debug(i, name);
    }
    return BigDecimal.round(result, rounding);
  };
}

function sqrt(x, rounding) {
  // from https://en.wikipedia.org/wiki/Square_root#Computation
  let lastResult = BigDecimal.add(x, convert(1));
  let result = x;
  while (BigDecimal.cmp(result, lastResult) < 0) {
    lastResult = result;
    result = BigDecimal.divide(BigDecimal.add(BigDecimal.divide(x, result, rounding), result), convert(2), rounding);
  }
  return result;
}

BigDecimal.log = tryToMakeCorrectlyRounded(1, function log(x, rounding) {
  if (BigDecimal.cmp(x, convert(0)) <= 0) {
    throw new RangeError();
  }
  // https://ru.wikipedia.org/wiki/Логарифм#Разложение_в_ряд_и_вычисление_натурального_логарифма
  const internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log2(rounding.maximumSignificantDigits + 0.5) * BASE_LOG2_INV),
    roundingMode: "half-even"
  };
  if (true) {
    //! ln(f * BASE**k) = ln(f) + k * ln(BASE), where (1/BASE) <= f <= BASE
    let k = getCountOfDigits(x) - 1n;
    let f = BigDecimal.multiply(exponentiateBase(-k), x);
    let ff = BigDecimal.round(BigDecimal.multiply(f, f), {maximumSignificantDigits: 3, roundingMode: "half-even"});
    if (BigDecimal.cmp(ff, exponentiateBase(1n)) > 0) {
      k += 1n;
      f = BigDecimal.multiply(exponentiateBase(-1n), f);
    }
    if (BigDecimal.cmp(ff, exponentiateBase(-1n)) < 0) {
      k -= 1n;
      f = BigDecimal.multiply(exponentiateBase(1n), f);
    }
    if (k !== 0n) {
      return BigDecimal.add(BigDecimal.log(f, internalRounding), BigDecimal.multiply(convert(2n * k), BigDecimal.log(sqrt(convert(BASE), internalRounding), internalRounding)));
    }
  }
  //! log(x) = log((1 + g) / (1 - g)) = 2*(g + g**3/3 + g**5/5 + ...)
  const g = BigDecimal.divide(BigDecimal.subtract(x, convert(1)), BigDecimal.add(x, convert(1)), internalRounding);
  let n = 1;
  let term = convert(1);
  let sum = term;
  let lastSum = convert(0);
  const gg = BigDecimal.multiply(g, g, internalRounding);
  while (BigDecimal.cmp(lastSum, sum) !== 0) {
    n += 2;
    term = BigDecimal.multiply(term, convert(n - 2));
    term = BigDecimal.multiply(term, gg);
    term = BigDecimal.divide(term, convert(n), internalRounding);
    lastSum = sum;
    sum = BigDecimal.add(sum, term, internalRounding);
  }
  return BigDecimal.multiply(BigDecimal.multiply(convert(2), g), sum);
}, "log");

function fromNumberApproximate(number) {
  return BigDecimal.divide(convert(Math.floor(number * (Number.MAX_SAFE_INTEGER + 1))),
                           BigDecimal.add(convert(Number.MAX_SAFE_INTEGER), convert(1)),
                           {maximumSignificantDigits: Math.floor(Math.log2(Number.MAX_SAFE_INTEGER + 1) * BASE_LOG2_INV + 0.5), roundingMode: "half-even"});
}

BigDecimal.exp = tryToMakeCorrectlyRounded(0, function exp(x, rounding) {
  //! k = round(x / ln(BASE));
  //! exp(x) = exp(x - k * ln(BASE) + k * ln(BASE)) = exp(x - k * ln(BASE)) * BASE**k
  const internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log2(rounding.maximumSignificantDigits + 0.5) * BASE_LOG2_INV),
    roundingMode: "half-even"
  };
  if (BigDecimal.cmp(x, convert(0)) !== 0) {
    const logBASEApproximate = fromNumberApproximate(Math.log(BASE));
    const kApproximate = BigDecimal.round(BigDecimal.divide(x, logBASEApproximate, {maximumSignificantDigits: Math.max(Number(getCountOfDigits(x)), 1), roundingMode: "half-even"}), {maximumFractionDigits: 0, roundingMode: "half-even"});
    if (BigDecimal.cmp(kApproximate, convert(0)) !== 0) {
      const logBASE = BigDecimal.log(convert(BASE), {maximumSignificantDigits: internalRounding.maximumSignificantDigits + Number(getCountOfDigits(kApproximate)), roundingMode: "half-even"});
      const k = BigDecimal.round(BigDecimal.divide(x, logBASE, {maximumSignificantDigits: Math.max(Number(getCountOfDigits(x)), 1), roundingMode: "half-even"}), {maximumFractionDigits: 0, roundingMode: "half-even"});
      if (BigDecimal.cmp(k, convert(0)) !== 0) {
        const r = BigDecimal.subtract(x, BigDecimal.multiply(k, logBASE));
        return BigDecimal.multiply(exponentiateBase(BigInt(toBigInt(k))), BigDecimal.exp(r, internalRounding));
      }
    }
  }
  // https://en.wikipedia.org/wiki/Exponential_function#Computation
  let n = 0;
  let term = convert(1);
  let sum = term;
  let lastSum = convert(0);
  while (BigDecimal.cmp(lastSum, sum) !== 0) {
    n += 1;
    term = BigDecimal.multiply(term, x);
    term = BigDecimal.divide(term, convert(n), internalRounding);
    lastSum = sum;
    sum = BigDecimal.add(sum, term, internalRounding);
  }
  return sum;
}, "exp");

function divideByHalfOfPI(x, rounding) { // x = k*pi/2 + r + 2*pi*n, where |r| < pi/4
  const quarterOfPiApproximated = fromNumberApproximate(Math.PI / 4);
  if (BigDecimal.cmp(BigDecimal.abs(x), quarterOfPiApproximated) > 0) {
    //TODO: FIX
    const internalRounding = {
      maximumSignificantDigits: rounding.maximumSignificantDigits + significandDigits(x) + Number(getCountOfDigits(x)) + 1 + Math.ceil(42 * BASE_LOG2_INV),
      roundingMode: "half-even"
    };
    const halfOfPi = BigDecimal.multiply(convert(2), BigDecimal.atan(convert(1), internalRounding));
    const i = BigDecimal.round(BigDecimal.divide(x, halfOfPi, {maximumSignificantDigits: Math.max(Number(getCountOfDigits(x)), 1), roundingMode: "half-even"}), {maximumFractionDigits: 0, roundingMode: "half-even"});
    const remainder = BigDecimal.subtract(x, BigDecimal.multiply(i, halfOfPi));
    return {remainder: remainder, k: (Number(BigInt(toBigInt(i)) % 4n) + 4) % 4};
  }
  return {remainder: x, k: 0};
}

function _cos(x, rounding, subtractHalfOfPi) {
  const tmp = divideByHalfOfPI(x, rounding);
  const a = tmp.remainder;
  const k = (tmp.k + (subtractHalfOfPi ? -1 + 4 : 0)) % 4;
  // https://en.wikipedia.org/wiki/Lookup_table#Computing_sines
  // https://en.wikipedia.org/wiki/Trigonometric_functions#Power_series_expansion
  const internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log2(rounding.maximumSignificantDigits + 0.5) * BASE_LOG2_INV),
    roundingMode: "half-even"
  };
  let n = k === 1 || k === 3 ? 1 : 0;
  let term = convert(1);
  let sum = term;
  let lastSum = convert(0);
  const aa = BigDecimal.multiply(a, a);
  while (BigDecimal.cmp(lastSum, sum) !== 0) {
    n += 2;
    term = BigDecimal.multiply(term, aa);
    term = BigDecimal.divide(term, convert(-n * (n - 1)), internalRounding);
    lastSum = sum;
    sum = BigDecimal.add(sum, term, internalRounding);
  }
  if (k === 1 || k === 2) {
    sum = BigDecimal.unaryMinus(sum);
  }
  return k === 1 || k === 3 ? BigDecimal.multiply(a, sum) : sum;
}

BigDecimal.sin = tryToMakeCorrectlyRounded(0, function (x, rounding) {
  return _cos(x, rounding, true);
}, "sin");

BigDecimal.cos = tryToMakeCorrectlyRounded(0, function (x, rounding) {
  return _cos(x, rounding, false);
}, "cos");

BigDecimal.atan = tryToMakeCorrectlyRounded(0, function (x, rounding) {
  if (BigDecimal.cmp(BigDecimal.abs(x), convert(1)) > 0) {
    //Note: rounding to maximumFractionDigits
    const internalRounding = {
      maximumFractionDigits: rounding.maximumSignificantDigits + 1,
      roundingMode: "half-even"
    };
    const halfOfPi = BigDecimal.multiply(BigDecimal.atan(convert(1), internalRounding), convert(2));
    return BigDecimal.multiply(convert(BigDecimal.cmp(x, convert(0)) < 0 ? -1 : +1), BigDecimal.subtract(halfOfPi, BigDecimal.atan(BigDecimal.divide(convert(1), BigDecimal.abs(x), internalRounding), internalRounding)));
  }
  // https://en.wikipedia.org/wiki/Inverse_trigonometric_functions#:~:text=Alternatively,%20this%20can%20be%20expressed%20as
  const internalRounding = {
    maximumSignificantDigits: rounding.maximumSignificantDigits + Math.ceil(Math.log2(rounding.maximumSignificantDigits + 0.5) * BASE_LOG2_INV),
    roundingMode: "half-even"
  };
  let n = 0;
  const xx = BigDecimal.multiply(x, x);
  const xxplus1 = BigDecimal.add(convert(1), xx);
  let term = BigDecimal.divide(convert(1), xxplus1, internalRounding);
  let sum = term;
  let lastSum = convert(0);
  while (BigDecimal.cmp(lastSum, sum) !== 0) {
    n += 1;
    term = BigDecimal.multiply(term, BigDecimal.multiply(convert(2 * n), xx));
    term = BigDecimal.divide(term, BigDecimal.multiply(convert(2 * n + 1), xxplus1), internalRounding);
    lastSum = sum;
    sum = BigDecimal.add(sum, term, internalRounding);
  }
  return BigDecimal.multiply(x, sum);
}, "atan");

BigDecimal.sqrt = function (x, rounding) {
  if (BigDecimal.cmp(x, convert(0)) < 0) {
    throw new RangeError();
  }
  if (BigDecimal.cmp(x, convert(0)) === 0) {
    return x;
  }
  // https://en.wikipedia.org/wiki/Nth_root#Using_Newton's_method
  const e = getCountOfDigits(x) / 2n;
  const t = exponentiateBase(e);
  const y = BigDecimal.multiply(x, exponentiateBase(-(2n * e)));
  const k = Math.floor(Math.log2(Number.MAX_SAFE_INTEGER + 1) * BASE_LOG2_INV) - 1;
  const xn = Number(toBigInt(BigDecimal.round(BigDecimal.multiply(y, exponentiateBase(k)), {maximumFractionDigits: 0, roundingMode: "half-even"}))) / BASE**k;
  const r = Math.sqrt(xn);
  //TODO: fix
  const resultSignificantDigits = 2 * (rounding.maximumSignificantDigits || (rounding.maximumFractionDigits + Math.ceil(significandDigits(x) / 2)) || 1);
  let result = BigDecimal.multiply(convert(Math.sign(r) * Math.floor(Math.abs(r) * BASE**k + 0.5)), exponentiateBase(-k));
  const iteration = function (result, internalRounding) {
    return BigDecimal.divide(BigDecimal.add(y, BigDecimal.multiply(result, result)), BigDecimal.multiply(convert(2), result), internalRounding);
  };
  for (let i = Math.max(k - 1, 1); i <= resultSignificantDigits; i *= 2) {
    const internalRounding = {maximumSignificantDigits: i, roundingMode: "half-even"};
    result = iteration(result, internalRounding);
  }
  result = iteration(result, rounding);
  return BigDecimal.multiply(result, t);
};

}

export default addMath;