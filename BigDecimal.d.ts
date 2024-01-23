type RoundingMode = "floor" | "down" | "ceil" | "up" | "half-even" | "half-up" | "half-down";

interface Rounding {
    roundingMode: RoundingMode;
    maximumSignificantDigits?: number;
    maximumFractionDigits?: number;
}

declare class BigDecimal {
    static BigDecimal(value: string | number | bigint | BigDecimal): BigDecimal;
    static unaryMinus(a: BigDecimal): BigDecimal;
    static add(a: BigDecimal, b: BigDecimal, rounding?: Rounding): BigDecimal;
    static subtract(a: BigDecimal, b: BigDecimal, rounding?: Rounding): BigDecimal;
    static multiply(a: BigDecimal, b: BigDecimal, rounding?: Rounding): BigDecimal;
    static divide(a: BigDecimal, b: BigDecimal, rounding?: Rounding): BigDecimal;

    static lessThan(a: BigDecimal, b: BigDecimal): boolean;
    static greaterThan(a: BigDecimal, b: BigDecimal): boolean;
    static equal(a: BigDecimal, b: BigDecimal): boolean;
    static round(a: BigDecimal, rounding: Rounding): BigDecimal;

    toString(): string;
    toFixed(fractionDigits: number, roundingMode?: RoundingMode): string;
    toPrecision(precision: number, roundingMode?: RoundingMode): string;
    toExponential(fractionDigits: number, roundingMode?: RoundingMode): string;

    static log(a: BigDecimal, rounding: Rounding): BigDecimal;
    static exp(a: BigDecimal, rounding: Rounding): BigDecimal;
    static sin(a: BigDecimal, rounding: Rounding): BigDecimal;
    static cos(a: BigDecimal, rounding: Rounding): BigDecimal;
    static atan(a: BigDecimal, rounding: Rounding): BigDecimal;
    static sqrt(a: BigDecimal, rounding: Rounding): BigDecimal;

    static abs(a: BigDecimal): BigDecimal;
    static sign(a: BigDecimal): number;
    static max(a: BigDecimal, b: BigDecimal): BigDecimal;
    static min(a: BigDecimal, b: BigDecimal): BigDecimal;
}

export { BigDecimal, Rounding, RoundingMode };
