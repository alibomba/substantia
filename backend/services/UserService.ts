import prisma from "../models/prisma";


class UserService {
    public async findUserByEmail(email: string) {
        return await prisma.user.findUnique({ where: { email } });
    }

    public async findUserBySlug(slug: string) {
        return await prisma.user.findUnique({ where: { slug } });
    }

    public async registerValidation(email: string, username: string, slug: string, password: string) {
        if (!email) throw new Error('Adres e-mail jest wymagany', { cause: 'VALIDATION' });
        if (email.length > 20) throw new Error('Adres może mieć maksymalnie 20 znaków', { cause: 'VALIDATION' });
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        if (!email.match(emailRegex)) throw new Error('Podaj poprawny adres e-mail', { cause: 'VALIDATION' });
        const emailFound = await this.findUserByEmail(email);
        if (emailFound) throw new Error('Adres e-mail jest już zajęty', { cause: 'VALIDATION' });
        if (!username) throw new Error('Nazwa użytkownika jest wymagana', { cause: 'VALIDATION' });
        if (username.length > 20) throw new Error('Nazwa użytkownika może mieć maksymalnie 20 znaków', { cause: 'VALIDATION' });
        if (!slug) throw new Error('Identyfikator jest wymagany', { cause: 'VALIDATION' });
        if (slug.length > 20) throw new Error('Identyfikator może mieć maksymalnie 20 znaków', { cause: 'VALIDATION' });
        const slugRegex = /^[a-z0-9]+$/;
        if (!slug.match(slugRegex)) throw new Error('Identyfikator może mieć tylko małe litery i cyfry', { cause: 'VALIDATION' });
        const slugFound = await this.findUserBySlug(slug);
        if (slugFound) throw new Error('Identyfikator jest już zajęty', { cause: 'VALIDATION' });
        if (!password) throw new Error('Hasło jest wymagane', { cause: 'VALIDATION' });
        if (password.length < 8 || password.length > 60) throw new Error('Hasło musi mieć pomiędzy 8 a 60 znaków', { cause: 'VALIDATION' });
    }

    public async createUser(email: string, username: string, slug: string, password: string) {
        return await prisma.user.create({ data: { email, username, slug, password, oAuth: false } });
    }

    public async getExistingSlugs() {
        const users = await prisma.user.findMany({ select: { slug: true } });
        return users.map(user => user.slug);
    }

    public async createOAuthUser(email: string, username: string, slug: string) {
        return await prisma.user.create({ data: { email, username, slug, oAuth: true } });
    }
}

export default new UserService();