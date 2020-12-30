
import BigDecimal2 from './BigDecimalByDecimal.js.js';
import {BigDecimal, BigFloat} from './BigDecimal.js';

console.time();

console.assert(BigDecimal.toNumber(BigDecimal.BigDecimal(100)) === 100);
console.assert(BigDecimal.toNumber(BigDecimal.unaryMinus(BigDecimal.BigDecimal(100))) === -100);
console.assert(BigDecimal.toNumber(BigDecimal.add(BigDecimal.BigDecimal(100), BigDecimal.BigDecimal(2))) === 102);
console.assert(BigDecimal.toNumber(BigDecimal.subtract(BigDecimal.BigDecimal(100), BigDecimal.BigDecimal(2))) === 98);
console.assert(BigDecimal.toNumber(BigDecimal.multiply(BigDecimal.BigDecimal(100), BigDecimal.BigDecimal(2))) === 200);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(100), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'floor' })) === 50);
console.assert(BigDecimal.lessThan(BigDecimal.BigDecimal(2), BigDecimal.BigDecimal(3)) === true);
console.assert(BigDecimal.lessThan(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(3)) === false);
console.assert(BigDecimal.lessThan(BigDecimal.BigDecimal(1), BigDecimal.BigDecimal(0)) === false);
console.assert(BigDecimal.lessThan(BigDecimal.BigDecimal(-1), BigDecimal.BigDecimal(0)) === true);
console.assert(BigDecimal.lessThan(BigDecimal.BigDecimal(0), BigDecimal.BigDecimal(0)) === false);
console.assert(BigDecimal.lessThan(BigDecimal.BigDecimal(0), BigDecimal.BigDecimal(1)) === true);
console.assert(BigDecimal.lessThan(BigDecimal.add(BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.BigDecimal(100), { maximumSignificantDigits: 1, roundingMode: 'floor' }), BigDecimal.BigDecimal(1)), BigDecimal.BigDecimal(2)));
console.assert(BigDecimal.lessThan(BigDecimal.add(BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.BigDecimal(100), { maximumFractionDigits: 2, roundingMode: 'floor' }), BigDecimal.BigDecimal(1)), BigDecimal.BigDecimal(2)));
console.assert(BigDecimal.lessThan(BigDecimal.BigDecimal(String(1/3)), BigDecimal.BigDecimal('0')) === false);

console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'floor' })) === 1);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'floor' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'floor' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'floor' })) === 1);

console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'floor' })) === 1);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'floor' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'floor' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'floor' })) === 1);

console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'ceil' })) === 2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'ceil' })) === -1);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'ceil' })) === -1);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'ceil' })) === 2);

console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'ceil' })) === 2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'ceil' })) === -1);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'ceil' })) === -1);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'ceil' })) === 2);

console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === 2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === 2);

console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === 2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === 2);

console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(5), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === 2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(5), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-5), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-5), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === 2);

console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(5), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === 2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(5), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-5), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-5), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === 2);

// double rounding
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(699), BigDecimal.BigDecimal(200), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === 3);

// bugs (thanks to https://github.com/MikeMcl/bignumber.js/issues/256):
console.assert(BigDecimal.add(BigDecimal.BigDecimal('2e-3'), BigDecimal.BigDecimal('-2e+1'), { maximumSignificantDigits: 1, roundingMode: 'floor' }).toString() === '-20');
console.assert(BigDecimal.add(BigDecimal.BigDecimal('4e-5'), BigDecimal.BigDecimal('-6e+4'), { maximumSignificantDigits: 1, roundingMode: 'ceil' }).toString() === '-50000');
console.assert(BigDecimal.add(BigDecimal.BigDecimal('-2e-7'), BigDecimal.BigDecimal('5e+0'), { maximumSignificantDigits: 3, roundingMode: 'ceil' }).toString() === '5');
console.assert(BigDecimal.add(BigDecimal.BigDecimal('1e+8'), BigDecimal.BigDecimal('-1e-8'), { maximumSignificantDigits: 1, roundingMode: 'floor' }).toString() === '90000000');
console.assert(BigDecimal.add(BigDecimal.BigDecimal('-1e+6'), BigDecimal.BigDecimal('-8e+8'), { maximumSignificantDigits: 3, roundingMode: 'floor' }).toString() === '-801000000');
console.assert(BigDecimal.add(BigDecimal.BigDecimal('-842e+671'), BigDecimal.BigDecimal('149e+37'), { maximumSignificantDigits: 367, roundingMode: 'ceil' }).toString() === '-8.419999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999e+673');
console.assert(BigDecimal.divide(BigDecimal.BigDecimal('-2e+1'), BigDecimal.BigDecimal('-3e+0'), { maximumSignificantDigits: 2, roundingMode: 'floor' }).toString() === '6.6');
console.assert(BigDecimal.divide(BigDecimal.BigDecimal('-3e-2'), BigDecimal.BigDecimal('-2e-3'), { maximumSignificantDigits: 2, roundingMode: 'floor' }).toString() === '15');
console.assert(BigDecimal.divide(BigDecimal.BigDecimal('-800e+447'), BigDecimal.BigDecimal('4e-697'), { maximumSignificantDigits: 1, roundingMode: 'ceil' }).toString() === '-2e+1146');
console.assert(BigDecimal.divide(BigDecimal.BigDecimal('1e-2'), BigDecimal.BigDecimal('-2e+1'), { maximumFractionDigits: 1, roundingMode: 'half-even' }).toString() === '0');
console.assert(BigDecimal.divide(BigDecimal.BigDecimal('-11e-1'), BigDecimal.BigDecimal('-3e-14'), { maximumSignificantDigits: 1, roundingMode: 'half-even' }).toString() === '40000000000000');
console.assert(BigDecimal.divide(BigDecimal.BigDecimal('6e+7'), BigDecimal.BigDecimal('-7e-2'), { maximumSignificantDigits: 1, roundingMode: 'half-even' }).toString() === '-900000000');
console.assert(BigDecimal.divide(BigDecimal.BigDecimal('6e-6'), BigDecimal.BigDecimal('-9e+3'), { maximumSignificantDigits: 1, roundingMode: 'floor' }).toString() === '-7e-10');

// special cases
//console.assert(BigDecimal.add(BigDecimal.BigDecimal('1e+10000000000000001'), BigDecimal.BigDecimal('1e+0'), { maximumSignificantDigits: 1, roundingMode: 'floor' }).toString() === '1e+10000000000000001');
//console.assert(BigDecimal.add(BigDecimal.BigDecimal('1e+10000000000000001'), BigDecimal.BigDecimal('1e-1'), { maximumFractionDigits: 0, roundingMode: 'floor' }).toString() === '1e+10000000000000001');
// console.time(); exponentiate(BigDecimal.BigDecimal(10), 1000000n); console.timeEnd();
//console.assert(BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.BigDecimal(10), {maximumSignificantDigits: 1e15}).toString(), '?'); // performance
//console.assert(BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.BigDecimal(10), {maximumFractionDigits: 1e15}).toString(), '?'); // performance
//console.assert(BigDecimal.exp(BigDecimal.BigDecimal('1e+100'), { maximumSignificantDigits: 1, roundingMode: 'half-even' }).toString() === '2e+4342944819032518276511289189166050822943970058036665661144537831658646492088707747292249493384317483');
//console.assert(BigDecimal.exp(BigDecimal.BigDecimal('-1e+100'), { maximumSignificantDigits: 1, roundingMode: 'half-even' }).toString() === '7e-4342944819032518276511289189166050822943970058036665661144537831658646492088707747292249493384317484');

// fromString
//console.assert(BigDecimal.BigDecimal(' +1.2e+3 ').toString() === '120');
console.assert(BigDecimal.BigDecimal('1e+2').toString() === '100');

// toString
console.assert(BigDecimal.BigDecimal(1).toString() === '1');
console.assert(BigDecimal.BigDecimal('999999999999999999999').toString() === '999999999999999999999'); // 1e+21 - 1
console.assert(BigDecimal.BigDecimal('1000000000000000000000').toString() === '1e+21');
console.assert(BigDecimal.BigDecimal('1.2345').toString() === '1.2345');
console.assert(BigDecimal.BigDecimal('0.000001').toString() === '0.000001');
console.assert(BigDecimal.BigDecimal('0.00000012').toString() === '1.2e-7');
console.assert(BigDecimal.BigDecimal(-1).toString() === '-1');
console.assert(BigDecimal.BigDecimal('1e+21').toString() === '1e+21');

// toExponential
//console.assert(BigDecimal.BigDecimal(' +1.2e+3 ').toExponential() === '1.2e+3');
console.assert(BigDecimal.BigDecimal('1.5').toExponential(0) === '2e+0');
console.assert(BigDecimal.BigDecimal('2.5').toExponential(0) === '3e+0');
console.assert(BigDecimal.BigDecimal('-1.5').toExponential(0) === '-2e+0');
console.assert(BigDecimal.BigDecimal('-2.5').toExponential(0) === '-3e+0');
console.assert(BigDecimal.BigDecimal('1.5').toExponential(1) === '1.5e+0');
console.assert(BigDecimal.BigDecimal('1234567890').toExponential(3) === '1.235e+9');

// toPrecision
console.assert(BigDecimal.BigDecimal('-1.5').toPrecision(1) === '-2');
console.assert(BigDecimal.BigDecimal('-1e-7').toPrecision(2) === '-1.0e-7');
console.assert(BigDecimal.BigDecimal('-1e-6').toPrecision(2) === '-0.0000010');
console.assert(BigDecimal.BigDecimal('-1.5').toPrecision(3) === '-1.50');
console.assert(BigDecimal.BigDecimal('95e-8').toPrecision(1) === '0.000001');
console.assert(BigDecimal.BigDecimal('94e-8').toPrecision(1) === '9e-7');

// toFixed
console.assert(BigDecimal.BigDecimal('-1.5').toFixed(0) === '-2');
console.assert(BigDecimal.BigDecimal('-1.5').toFixed(1) === '-1.5');
console.assert(BigDecimal.BigDecimal('-1.5').toFixed(2) === '-1.50');
console.assert(BigDecimal.BigDecimal('1.5e+1').toFixed(2) === '15.00');
console.assert(BigDecimal.BigDecimal('5e-1').toFixed(0) === '1');
console.assert(BigDecimal.BigDecimal('0').toFixed(0) === '0');
console.assert(BigDecimal.BigDecimal('999999999999999999999.4').toFixed(0) === '999999999999999999999');
//console.assert(BigDecimal.BigDecimal('999999999999999999999.5').toFixed(0) === '1e+21'); //TODO: not specified (!)
//console.assert(BigDecimal.BigDecimal('1e+21').toFixed(0) === '1e+21');
console.assert(BigDecimal.BigDecimal('-1e-100').toFixed(10) === '-0.0000000000');

// BigDecimal.log
console.assert(BigDecimal.log(BigDecimal.BigDecimal(10), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '2.302585092994046');
console.assert(BigDecimal.log(BigDecimal.BigDecimal(2), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '0.6931471805599453');
console.assert(BigDecimal.log(BigDecimal.BigDecimal(1e10), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '23.02585092994046');
console.assert(BigDecimal.log(BigDecimal.BigDecimal('0.01'), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '-4.605170185988091');
console.assert(BigDecimal.log(BigDecimal.BigDecimal('0.1'), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '-2.302585092994046');
console.assert(BigDecimal.log(BigDecimal.BigDecimal(1), { maximumSignificantDigits: 16, roundingMode: 'ceil' }).toString() === '0');
console.assert(BigDecimal.log(BigDecimal.BigDecimal(1), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '0');
console.assert(BigDecimal.log(BigDecimal.BigDecimal(1), { maximumSignificantDigits: 16, roundingMode: 'floor' }).toString() === '0');
console.assert(BigDecimal.log(BigDecimal.BigDecimal('2.718281830905498'), { maximumSignificantDigits: 16, roundingMode: 'floor' }).toString() === '1.000000000899999');
console.assert(BigDecimal.log(BigDecimal.BigDecimal('2.718281830905498'), { maximumSignificantDigits: 11, roundingMode: 'floor' }).toString() === '1.0000000008');
console.assert(BigDecimal.log(BigDecimal.BigDecimal('2.718281830905498'), { maximumSignificantDigits: 12, roundingMode: 'ceil' }).toString() === '1.0000000009');
console.assert(BigDecimal.log(BigDecimal.BigDecimal('2.718281830905498'), { maximumSignificantDigits: 1, roundingMode: 'floor' }).toString() === '1');
console.assert(BigDecimal.log(BigDecimal.BigDecimal('2.718281830905498'), { maximumSignificantDigits: 1, roundingMode: 'ceil' }).toString() === '2');
console.assert(BigDecimal.log(BigDecimal.BigDecimal('1e-10'), { maximumSignificantDigits: 8, roundingMode: 'half-even' }).toString() === '-23.025851');

// BigDecimal.exp
console.assert(BigDecimal.exp(BigDecimal.BigDecimal(1), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '2.718281828459045');
console.assert(BigDecimal.exp(BigDecimal.BigDecimal(700), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '1.014232054735005e+304');
console.assert(BigDecimal.exp(BigDecimal.BigDecimal(-10), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '0.00004539992976248485');
console.assert(BigDecimal.exp(BigDecimal.BigDecimal(0), { maximumSignificantDigits: 16, roundingMode: 'ceil' }).toString() === '1');
console.assert(BigDecimal.exp(BigDecimal.BigDecimal(0), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '1');
console.assert(BigDecimal.exp(BigDecimal.BigDecimal(0), { maximumSignificantDigits: 16, roundingMode: 'floor' }).toString() === '1');
console.assert(BigDecimal.exp(BigDecimal.BigDecimal(-100), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '3.720075976020836e-44');
console.assert(BigDecimal.exp(BigDecimal.BigDecimal(10), { maximumSignificantDigits: 11, roundingMode: 'half-even' }).toString() === '22026.465795');

// BigDecimal.sin
console.assert(BigDecimal.sin(BigDecimal.BigDecimal(1), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '0.8414709848078965');
console.assert(BigDecimal.sin(BigDecimal.BigDecimal(3), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '0.1411200080598672');
console.assert(BigDecimal.sin(BigDecimal.BigDecimal(4), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '-0.7568024953079283');
console.assert(BigDecimal.sin(BigDecimal.BigDecimal('-25.132741228718345'), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '9.07701147066236e-16');
console.assert(BigDecimal.sin(BigDecimal.BigDecimal(0), { maximumSignificantDigits: 16, roundingMode: 'ceil' }).toString() === '0');
console.assert(BigDecimal.sin(BigDecimal.BigDecimal(0), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '0');
console.assert(BigDecimal.sin(BigDecimal.BigDecimal(0), { maximumSignificantDigits: 16, roundingMode: 'floor' }).toString() === '0');
console.assert(BigDecimal.equal(BigDecimal.sin(BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 16, roundingMode: 'floor' }), BigDecimal.unaryMinus(BigDecimal.sin(BigDecimal.BigDecimal(2), { maximumSignificantDigits: 16, roundingMode: 'ceil' }))));
//console.assert(BigDecimal.sin(BigDecimal.BigDecimal('25e-10000'), { maximumSignificantDigits: 1, roundingMode: 'half-even' }).toString() === '?');

// BigDecimal.cos
console.assert(BigDecimal.cos(BigDecimal.BigDecimal(1), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '0.5403023058681397');
console.assert(BigDecimal.cos(BigDecimal.BigDecimal(3), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '-0.9899924966004455');
console.assert(BigDecimal.cos(BigDecimal.BigDecimal(4), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '-0.6536436208636119');
console.assert(BigDecimal.cos(BigDecimal.BigDecimal(0), { maximumSignificantDigits: 16, roundingMode: 'ceil' }).toString() === '1');
console.assert(BigDecimal.cos(BigDecimal.BigDecimal(0), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '1');
console.assert(BigDecimal.cos(BigDecimal.BigDecimal(0), { maximumSignificantDigits: 16, roundingMode: 'floor' }).toString() === '1');
console.assert(BigDecimal.cos(BigDecimal.BigDecimal('8e+9'), { maximumSignificantDigits: 9, roundingMode: 'floor' }).toString() === '-0.0930906136'); // bug
console.assert(BigDecimal.cos(BigDecimal.BigDecimal('-10e-9'), {maximumSignificantDigits: 1, roundingMode: 'floor'}).toString() === '0.9');

// BigDecimal.atan
console.assert(BigDecimal.multiply(BigDecimal.BigDecimal(4), BigDecimal.atan(BigDecimal.BigDecimal(1), { maximumSignificantDigits: 16, roundingMode: 'half-even' })).toString() === '3.1415926535897932');
console.assert(BigDecimal.multiply(BigDecimal.BigDecimal(6), BigDecimal.atan(BigDecimal.BigDecimal('0.5773502691896258'), { maximumSignificantDigits: 16, roundingMode: 'half-even' })).toString() === '3.1415926535897934');
console.assert(BigDecimal.multiply(BigDecimal.BigDecimal(3), BigDecimal.atan(BigDecimal.BigDecimal('1.7320508075688772'), { maximumSignificantDigits: 16, roundingMode: 'half-even' })).toString() === '3.141592653589794');
console.assert(BigDecimal.atan(BigDecimal.BigDecimal(100), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '1.560796660108231');
console.assert(BigDecimal.atan(BigDecimal.BigDecimal(0), { maximumSignificantDigits: 16, roundingMode: 'ceil' }).toString() === '0');
console.assert(BigDecimal.atan(BigDecimal.BigDecimal(0), { maximumSignificantDigits: 16, roundingMode: 'half-even' }).toString() === '0');
console.assert(BigDecimal.atan(BigDecimal.BigDecimal(0), { maximumSignificantDigits: 16, roundingMode: 'floor' }).toString() === '0');
console.assert(BigDecimal.equal(BigDecimal.atan(BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 16, roundingMode: 'half-even' }), BigDecimal.unaryMinus(BigDecimal.atan(BigDecimal.BigDecimal(2), { maximumSignificantDigits: 16, roundingMode: 'half-even' }))));
console.assert(BigDecimal.equal(BigDecimal.atan(BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 16, roundingMode: 'floor' }), BigDecimal.unaryMinus(BigDecimal.atan(BigDecimal.BigDecimal(2), { maximumSignificantDigits: 16, roundingMode: 'ceil' }))));

//BigDecimal2

// random tests:

for (var c = 0; c < 1000; c += 1) {
  var aValue = ((1 + Math.random()) + 'e+' + (Math.floor(Math.random() * 20) - 10)).replace(/\+\-/g, '-');
  var bValue = ((1 + Math.random()) + 'e+' + (Math.floor(Math.random() * 20) - 10)).replace(/\+\-/g, '-');
  var a = BigDecimal.BigDecimal(aValue);
  var b = BigDecimal.BigDecimal(bValue);
  var operations = 'add subtract multiply divide log exp sin cos atan'.split(' ');
  var operation = operations[Math.floor(Math.random() * operations.length)];
  //var roundingType = Math.random() < 0.5 ? 'maximumSignificantDigits' : 'maximumFractionDigits';
  var roundingType = 'maximumSignificantDigits';
  var roundingModes = 'ceil floor half-even half-up half-down'.split(' ');
  var roundingMode = roundingModes[Math.floor(Math.random() * roundingModes.length)];
  var decimalDigits = Math.floor(Math.random() * 20);
  var rounding = {
    roundingMode: roundingMode,
    maximumSignificantDigits: roundingType === 'maximumSignificantDigits' ? Math.max(1, decimalDigits) : undefined,
    maximumFractionDigits: roundingType === 'maximumFractionDigits' ? Math.max(0, decimalDigits) : undefined
  };
  var zero = BigDecimal.BigDecimal('0');
  if (operation === 'atan') {
    aValue = '1';
    a = BigDecimal.BigDecimal(1);
  }
  if ((operation !== 'divide' || !BigDecimal.equal(b, zero)) && (operation !== 'log' || BigDecimal.greaterThan(a, zero))) {
    var cc = /^(log|exp|sin|cos|atan)$/.test(operation) ? BigDecimal[operation](a, rounding) : BigDecimal[operation](a, b, rounding);
    var expected = /^(log|exp|sin|cos|atan)$/.test(operation) ? BigDecimal2[operation](BigDecimal2.BigDecimal(aValue), rounding) : BigDecimal2[operation](BigDecimal2.BigDecimal(aValue), BigDecimal2.BigDecimal(bValue), rounding);
    if (cc.exponent > 9000000000000000n) {
      cc = 'Infinity';
    }
    if (cc.exponent < -9000000000000000n) {
      cc = '0';
    }
    if (cc.toString() !== expected.toString()) {
      console.log(cc.toString(), expected.toString());
      throw new Error(c);
    }
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNumber() {
  var significand = 1 + Math.random() * 0.5;
  var exponent = random(-1022, 1023);
  var sign = Math.random() < 0.5 ? -1 : +1;
  var value = sign * significand * Math.pow(2, exponent);
  return Math.sign(value) * Math.max(Math.min(Math.abs(value), Number.MAX_VALUE), 2**-1022);
}

function bigdecimalFromNumber(number) {
  var exponent = Math.floor(Math.log2(Math.abs(number)));
  if (Math.abs(number) < 2**exponent) {
    exponent -= 1;
  }
  const sign = BigDecimal.BigDecimal(Math.sign(number));
  const decimal = BigDecimal.divide(BigDecimal.BigDecimal(Math.abs(number) / 2**exponent * (Number.MAX_SAFE_INTEGER + 1) / 2), BigDecimal.BigDecimal((Number.MAX_SAFE_INTEGER + 1) / 2));
  const scale = exponent >= 0 ? BigDecimal.BigDecimal(2**exponent) : BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.BigDecimal(2**-exponent));
  return BigDecimal.multiply(sign, BigDecimal.multiply(decimal, scale));
}

for (var c = 0; c < 1000; c += 1) {
  var number = randomNumber();
  var bigdecimal = bigdecimalFromNumber(number);
  // https://github.com/tc39/ecma402/issues/128
  var maxFraction = random(0, 20);
  var minFraction = random(0, 20);
  var rounded = BigDecimal.round(BigDecimal.BigDecimal(number.toString()), { maximumFractionDigits: maxFraction, roundingMode: 'half-up' });
  function string(rounded, maxFraction) {
    return rounded.toLocaleString('en-US', { maximumFractionDigits: maxFraction, minimumFractionDigits: Math.min(maxFraction, minFraction), useGrouping: false });
  }
  var a = Number(string(number, maxFraction)).toString();
  var b = rounded.toString();
  if (/^\-0\.?0*$/.test(a)) {
    b = '-' + b;
  }
  if (a !== b) {
    console.log(a);
    console.log(b);
    console.log(c);
    throw new RangeError(number);
  }
}

console.timeEnd();
console.log('ok');

globalThis.BigDecimal = BigDecimal;

// benchmarks:
// 10 digits, 1000 digits
// atan, exp

console.time('10 digits of π × 1000');
for (var i = 0; i < 1000; i += 1) {
  var pi = BigDecimal.multiply(BigDecimal.BigDecimal(4), BigDecimal.atan(BigDecimal.BigDecimal(1), { maximumSignificantDigits: 10, roundingMode: 'half-even' }));
  console.assert(pi.toString() === '3.1415926536');
}
console.timeEnd('10 digits of π × 1000');

console.time('1000 digits of π');
var pi = BigDecimal.multiply(BigDecimal.BigDecimal(4), BigDecimal.atan(BigDecimal.BigDecimal(1), { maximumSignificantDigits: 1000, roundingMode: 'half-even' }));
console.timeEnd('1000 digits of π');
console.log(pi.toString());

console.time('10 digits of ℯ × 1000');
for (var i = 0; i < 1000; i += 1) {
  var e = BigDecimal.exp(BigDecimal.BigDecimal(1), { maximumSignificantDigits: 10, roundingMode: 'half-even' });
  console.assert(e.toString() === '2.718281828');
}
console.timeEnd('10 digits of ℯ × 1000');

console.time('1000 digits of ℯ');
var e = BigDecimal.exp(BigDecimal.BigDecimal(1), { maximumSignificantDigits: 1000, roundingMode: 'half-even' });
console.timeEnd('1000 digits of ℯ');
console.log(e.toString());

console.time('10 digits of ln(2) × 1000');
for (var i = 0; i < 1000; i += 1) {
  var e = BigDecimal.log(BigDecimal.BigDecimal(2), { maximumSignificantDigits: 10, roundingMode: 'half-even' });
  console.assert(e.toString() === '0.6931471806');
}
console.timeEnd('10 digits of ln(2) × 1000');

console.time('1000 digits of ln(2)');
var e = BigDecimal.log(BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1000, roundingMode: 'half-even' });
console.timeEnd('1000 digits of ln(2)');
console.log(e.toString());

console.time('1000 digits of ln(2) using BigFloat');
var e = BigFloat.log(BigFloat.BigFloat(2), { maximumSignificantDigits: Math.ceil(1000 * Math.log2(10)), roundingMode: 'half-even' });
console.timeEnd('1000 digits of ln(2) using BigFloat');
console.log(e.toFixed(1000));
globalThis.BigFloat = BigFloat;

console.assert(BigFloat.divide(BigFloat.BigFloat(49151), BigFloat.BigFloat(2**15)).toPrecision(1) === '1');
console.assert(BigFloat.divide(BigFloat.BigFloat(13835058055282163711n), BigFloat.BigFloat(2n**63n)).toPrecision(1) === '1');
console.assert(BigFloat.BigFloat(1).toPrecision(101) === '1.' + '0'.repeat(100));
console.assert(BigFloat.BigFloat(46892389.03583745).toPrecision(34) === '46892389.03583744913339614868164063');
console.assert(BigFloat.BigFloat(-9422.84286622639).toExponential(36) === "-9.422842866226390469819307327270507813e+3");
console.assert(BigFloat.exp(BigFloat.BigFloat(710), { maximumSignificantDigits: 1, roundingMode: 'half-even' }).toPrecision(1) === "2e+308");
console.assert(BigFloat.exp(BigFloat.BigFloat(-739), { maximumSignificantDigits: 9, roundingMode: 'half-even' }).toPrecision(4) === "1.139e-321");


console.time();
for (var c = 0; c < 10000; c += 1) {
  var number = randomNumber();
  var bigfloat = BigFloat.BigFloat(number);
  var n = random(0, 100);
  if (Math.abs(number) <= 999999999999999868928) {
    console.assert(bigfloat.toFixed(n) === number.toFixed(n), bigfloat.toFixed(n), number.toFixed(n));
  }
  console.assert(bigfloat.toExponential(n) === number.toExponential(n), number, n, bigfloat.toExponential(n), number.toExponential(n));
  console.assert(bigfloat.toPrecision(Math.min(n + 1, 100)) === number.toPrecision(Math.min(n + 1, 100)), number);
}
console.timeEnd();
// default: 6836.679931640625 ms


var roundNumber = function (number, precision) {
  var v = number * 2**(53-precision);
  return v - (v - number);//?
};

console.time();
for (var c = 0; c < 1000; c += 1) {
  var number = roundNumber(randomNumber(), 18);
  //var number = 2;
  //var number = -2.05986225550976e+168;
  //var number = Number.MAX_VALUE;
  //debugger;
  if (number !== 0 && !Number.isNaN(number)) {
    var bigfloat = BigFloat.BigFloat(number);
    var f = 'sin cos atan exp log'.split(' ')[Math.floor(Math.random() * 5)];
    //f = 'cos';
    var value = Math[f](number);
    if (Math.abs(value) > 0 && Math.abs(value) < 1/0) {
      if (f !== 'log' || number > 0) {
        var n = 20;
        var a = BigFloat[f](bigfloat, {maximumSignificantDigits: 18, roundingMode: 'half-even'}).toPrecision(n);
        var b = roundNumber(value, 18).toPrecision(n);
        console.assert(a === b, number, f, a, b);
      }
    }
  }
}
console.timeEnd();

console.time();
var s = 0;
for (var i = 0; i < 1000; i += 1) {
  s += Math.cos(Number(BigInt(i)));
  console.assert(s.toPrecision(20).length > 1);
}
console.timeEnd();
console.log(s);

globalThis.randomNumber = randomNumber;
globalThis.roundNumber = roundNumber;
