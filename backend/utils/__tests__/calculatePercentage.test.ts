import { describe, expect, it } from "vitest";
import calculatePercentage from "../calculatePercentage";

describe('calculatePercentage', () => {
    it('returns correct value', () => {
        const data = [
            { arguments: [1, 1], expectation: 100 },
            { arguments: [1, .5], expectation: 50 },
            { arguments: [1, .337], expectation: 34 },
            { arguments: [1, .335], expectation: 34 },
            { arguments: [200, 80], expectation: 40 },
        ];

        data.forEach(item => {
            const result = calculatePercentage(item.arguments[0], item.arguments[1]);
            expect(result).toBe(item.expectation);
        });
    });
});