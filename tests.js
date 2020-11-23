
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
//console.assert(BigDecimal.lessThan(BigDecimal.add(BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.BigDecimal(100), { maximumFractionDigits: 2, roundingMode: 'floor' }), BigDecimal.BigDecimal(1)), BigDecimal.BigDecimal(2)));
console.assert(BigDecimal.lessThan(BigDecimal.BigDecimal(String(1/3)), BigDecimal.BigDecimal('0')) === false);

console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'floor' })) === 1);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'floor' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'floor' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'floor' })) === 1);

//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'floor' })) === 1);
//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'floor' })) === -2);
//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'floor' })) === -2);
//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'floor' })) === 1);

console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'ceil' })) === 2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'ceil' })) === -1);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'ceil' })) === -1);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'ceil' })) === 2);

//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'ceil' })) === 2);
//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'ceil' })) === -1);
//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'ceil' })) === -1);
//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'ceil' })) === 2);

console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === 2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === 2);

//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === 2);
//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(3), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === -2);
//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === -2);
//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-3), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === 2);

console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(5), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === 2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(5), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-5), BigDecimal.BigDecimal(2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === -2);
console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-5), BigDecimal.BigDecimal(-2), { maximumSignificantDigits: 1, roundingMode: 'half-even' })) === 2);

//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(5), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === 2);
//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(5), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === -2);
//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-5), BigDecimal.BigDecimal(2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === -2);
//console.assert(BigDecimal.toNumber(BigDecimal.divide(BigDecimal.BigDecimal(-5), BigDecimal.BigDecimal(-2), { maximumFractionDigits: 0, roundingMode: 'half-even' })) === 2);

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
//console.assert(BigDecimal.divide(BigDecimal.BigDecimal('1e-2'), BigDecimal.BigDecimal('-2e+1'), { maximumFractionDigits: 1, roundingMode: 'half-even' }).toString() === '0');
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
console.assert(BigDecimal.BigDecimal('999999999999999999999.5').toFixed(0) === '1e+21'); //TODO: not specified (!)
console.assert(BigDecimal.BigDecimal('1e+21').toFixed(0) === '1e+21');
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
function randomInteger() {
  var max = 10;
  var min = 10;
  return Math.floor(Math.random() * (max + min)) - min;
}

for (var c = 0; c < 1000; c += 1) {
  var aValue = (randomInteger() + 'e+' + randomInteger()).replace(/\+\-/g, '-');
  var bValue = (randomInteger() + 'e+' + randomInteger()).replace(/\+\-/g, '-');
  var a = BigDecimal.BigDecimal(aValue);
  var b = BigDecimal.BigDecimal(bValue);
  var operations = 'add subtract multiply divide log exp sin cos atan'.split(' ');
  var operation = operations[(randomInteger() % operations.length + operations.length) % operations.length];
  //var roundingType = randomInteger() % 2 === 0 ? 'maximumSignificantDigits' : 'maximumFractionDigits';
  var roundingType = 'maximumSignificantDigits';
  var roundingModes = 'ceil floor half-even half-up half-down'.split(' ');
  var roundingMode = roundingModes[(randomInteger() % roundingModes.length + roundingModes.length) % roundingModes.length];
  var decimalDigits = randomInteger();
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

for (var c = 0; c < 1000; c += 1) {
  var significand = 1 + Math.random() * 0.5;
  var exponent = random(-1022, 1023);
  var sign = Math.random() < 0.5 ? -1 : +1;
  var value = sign * significand * Math.pow(2, exponent);
  var number = Number(value);
  var bigdecimal = BigDecimal.divide(BigDecimal.BigDecimal(significand * 2**52), BigDecimal.BigDecimal(2**52), { maximumSignificantDigits: 1000, roundingMode: 'ceil' });
  if (exponent >= 0) {
    bigdecimal = BigDecimal.multiply(bigdecimal, BigDecimal.BigDecimal(2**exponent));
  } else {
    bigdecimal = BigDecimal.divide(bigdecimal, BigDecimal.BigDecimal(2**-exponent), { maximumSignificantDigits: 1000, roundingMode: 'ceil' });
  }
  bigdecimal = BigDecimal.multiply(bigdecimal, BigDecimal.BigDecimal(sign))
  if (Math.abs(number) < 2**-1022) {
    number = sign * 2**-1022;
    bigdecimal = BigDecimal.divide(BigDecimal.BigDecimal(1), BigDecimal.BigDecimal(1 / number));
  }
  if (Math.abs(number) === 1 / 0) {
    number = sign * Number.MAX_VALUE;
    bigdecimal = BigDecimal.BigDecimal(number);
  }
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