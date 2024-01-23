
import Decimal from './node_modules/decimal.js/decimal.mjs';

function rm(roundingMode) {
  if (roundingMode === 'floor') {
    return Decimal.ROUND_FLOOR;
  }
  if (roundingMode === 'ceil') {
    return Decimal.ROUND_CEIL;
  }
  if (roundingMode === 'up') {
    return Decimal.ROUND_UP;
  }
  if (roundingMode === 'down') {
    return Decimal.ROUND_DOWN;
  }
  if (roundingMode === 'half-even') {
    return Decimal.ROUND_HALF_EVEN;
  }
  if (roundingMode === 'half-up') {
    return Decimal.ROUND_HALF_UP;
  }
  if (roundingMode === 'half-down') {
    return Decimal.ROUND_HALF_DOWN;
  }
  throw new RangeError('rounding mode: ' + roundingMode);
}

function setRounding(rounding) {
  if (rounding != null) {
    if (rounding.maximumFractionDigits != undefined) {
      throw new RangeError('rounding to maximumFractionDigits is not supported');
    }
    Decimal.precision = rounding.maximumSignificantDigits;
    Decimal.rounding = rm(rounding.roundingMode);
  } else {
    Decimal.precision = 1e+9;
  }
}

function BigDecimal() {
}
BigDecimal.BigDecimal = function (value) {
  return Decimal(typeof value === 'number' ? value : value.toString());
};
BigDecimal.unaryMinus = function (a) {
  return a.negated();
};
BigDecimal.add = function (a, b, rounding) {
  setRounding(rounding);
  return a.add(b);
};
BigDecimal.subtract = function (a, b, rounding) {
  setRounding(rounding);
  return a.sub(b);
};
BigDecimal.multiply = function (a, b, rounding) {
  setRounding(rounding);
  return a.mul(b);
};
BigDecimal.divide = function (a, b, rounding) {
  if (rounding == null) {
    //throw new RangeError();
    setRounding(null); // it is working for exact divisions and throws an exception for inexact, seems
  } else {
    setRounding(rounding);
  }
  return a.div(b);
};

BigDecimal.cmp = function (a, b) {
  return a.lt(b) ? -1 : (b.lt(a) ? +1 : 0);
};

BigDecimal.cos = function (a, rounding) {
  setRounding(rounding);
  return a.cos();
};
BigDecimal.sin = function (a, rounding) {
  setRounding(rounding);
  return a.sin();
};
BigDecimal.exp = function (a, rounding) {
  setRounding(rounding);
  return a.exp();
};
BigDecimal.log = function (a, rounding) {
  setRounding(rounding);
  return a.ln();
};
BigDecimal.atan = function (a, rounding) {
  setRounding(rounding);
  return a.atan();
};
BigDecimal.sqrt = function (a, rounding) {
  setRounding(rounding);
  return a.sqrt();
};

BigDecimal.round = function (a, rounding) {
  if (rounding.maximumFractionDigits != undefined) {
    return a.toDecimalPlaces(rounding.maximumFractionDigits, rm(rounding.roundingMode));
  }
  if (rounding.maximumSignificantDigits == undefined) {
    throw new RangeError('rounding without maximumSignificantDigits is not supported');
  }
  return a.toSignificantDigits(rounding.maximumSignificantDigits, rm(rounding.roundingMode));
};

export default BigDecimal;
