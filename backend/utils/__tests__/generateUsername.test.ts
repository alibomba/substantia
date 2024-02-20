import { describe, expect, it } from "vitest";
import { generateUsername } from "..";

describe('generateUsername', () => {
    describe('e-mail without delimiter given', () => {
        it('returns a correct username', () => {
            const email = 'testuser@gmail.com';
            const username = generateUsername(email);
            expect(username).toBe('Testuser');
        });
    });

    describe('e-mail with one delimeter given', () => {
        it('returns a correct username', () => {
            const emails = ['test.user@interia.pl', 'test#user@interia.pl', 'test$user@onet.pl', 'test!user@op.pl', 'test/user@gmail.com'];
            emails.forEach(email => {
                const result = generateUsername(email);
                expect(result).toBe('TestUser');
            });
        });
    });

    describe('e-mail with multiple delimeters given', () => {
        it('returns a correct username', () => {
            const data = [
                { email: 'test.user.one@gmail.com', assertion: 'TestUserOne' },
                { email: 'test#user.two@gmail.com', assertion: 'TestUserTwo' },
            ]
            data.forEach(item => {
                const result = generateUsername(item.email);
                expect(result).toBe(item.assertion);
            });
        });
    });
});
