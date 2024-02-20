import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateUniqueSlug } from "..";
import UserService from "../../services/UserService";

vi.mock('../../models/prisma');

const mockGetExistingSlugs = vi.spyOn(UserService, 'getExistingSlugs');

beforeEach(() => {
    vi.resetAllMocks();
});

describe('generateUniqueSlug', () => {
    describe('no existing slug was found', () => {
        describe('e-mail without delimeter given', () => {
            it('returns a correct slug', async () => {
                mockGetExistingSlugs.mockResolvedValueOnce([]);
                const email = 'testuser@gmail.com';
                const slug = await generateUniqueSlug(email);
                expect(slug).toBe('testuser');
            });
        });

        describe('e-mail with one delimeter given', () => {
            it('returns a correct slug', async () => {
                mockGetExistingSlugs.mockResolvedValue([]);
                const emails = ['test.user@interia.pl', 'test#user@interia.pl', 'test$user@onet.pl', 'test!user@op.pl', 'test/user@gmail.com'];
                await Promise.all(emails.map(async email => {
                    const result = await generateUniqueSlug(email);
                    expect(result).toBe('testuser');
                }));
            });
        });

        describe('e-mail with multiple delimiters given', () => {
            it('returns a correct slug', async () => {
                mockGetExistingSlugs.mockResolvedValue([]);
                const data = [
                    { email: 'test.user.one@gmail.com', assertion: 'testuserone' },
                    { email: 'test#user.two@gmail.com', assertion: 'testusertwo' },
                ];
                await Promise.all(data.map(async item => {
                    const result = await generateUniqueSlug(item.email);
                    expect(result).toBe(item.assertion);
                }));
            });
        });
    });

    describe('one existing slug was found', () => {
        it('returns a correct slug', async () => {
            mockGetExistingSlugs.mockResolvedValueOnce(['testuser']);
            const email = 'test.user@gmail.com';
            const slug = await generateUniqueSlug(email);
            expect(slug).toBe('testuser1');
        });
    });

    describe('more existing slugs were found', () => {
        it('returns a correct slug', async () => {
            mockGetExistingSlugs.mockResolvedValueOnce(['testuser', 'testuser1', 'testuser2']);
            const email = 'test#user@op.pl';
            const slug = await generateUniqueSlug(email);
            expect(slug).toBe('testuser3');
        });
    });
});