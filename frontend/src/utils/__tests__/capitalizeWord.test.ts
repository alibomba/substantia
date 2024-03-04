import capitalizeWord from "../capitalizeWord";

describe('capitalizeWord', () => {
    it('returns correct value', () => {
        const data = [
            { argument: 'test', expectation: 'Test' },
            { argument: 'something', expectation: 'Something' },
            { argument: 'AlreadyCaps', expectation: 'AlreadyCaps' }
        ]
        data.forEach(item => {
            const result = capitalizeWord(item.argument);
            expect(result).toBe(item.expectation)
        });
    });
});