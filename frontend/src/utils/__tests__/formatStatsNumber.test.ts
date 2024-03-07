import { describe, expect, it } from "vitest";
import formatStatsNumber from "../formatStatsNumber";

describe('formatStatsNumber', () => {
    describe('function receives a number below 1 thousand', () => {
        it('returns the same value as a string', () => {
            const data = [12, 310, 999, 87];
            data.forEach(item => {
                const result = formatStatsNumber(item);
                expect(result).toBe(item.toString());
            });
        });
    });

    describe('function receives a number in thousands', () => {
        it('returns a string in format ${thousands}k', () => {
            const data = [
                { argument: 1000, expectation: '1k' },
                { argument: 3000, expectation: '3k' },
                { argument: 20000, expectation: '20k' },
                { argument: 51000, expectation: '51k' },
                { argument: 101212, expectation: '101.2k' },
                { argument: 999999, expectation: '999.9k' },
                { argument: 804985, expectation: '804.9k' },
            ];
            data.forEach(item => {
                const result = formatStatsNumber(item.argument);
                expect(result).toBe(item.expectation);
            });
        });
    });

    describe('function receives a number in millions', () => {
        it('returns a string in format ${millions}M', () => {
            const data = [
                { argument: 1000000, expectation: '1M' },
                { argument: 3000000, expectation: '3M' },
                { argument: 20000000, expectation: '20M' },
                { argument: 51000000, expectation: '51M' },
                { argument: 101212887, expectation: '101.2M' },
                { argument: 999900123, expectation: '999.9M' },
                { argument: 804985112, expectation: '804.9M' },
            ];
            data.forEach(item => {
                const result = formatStatsNumber(item.argument);
                expect(result).toBe(item.expectation);
            });
        });
    });

    describe('function receives a number in billions', () => {
        it('returns a string in format ${billions}B', () => {
            const data = [
                { argument: 1000000000, expectation: '1B' },
                { argument: 3000000000, expectation: '3B' },
                { argument: 20000000000, expectation: '20B' },
                { argument: 51000000000, expectation: '51B' },
                { argument: 101212887182, expectation: '101.2B' },
                { argument: 999900123938, expectation: '999.9B' },
                { argument: 804985112559, expectation: '804.9B' },
            ];
            data.forEach(item => {
                const result = formatStatsNumber(item.argument);
                expect(result).toBe(item.expectation);
            });
        });
    });
});