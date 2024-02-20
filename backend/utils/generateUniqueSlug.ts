import UserService from "../services/UserService";

async function generateUniqueSlug(email: string) {
    const atIndex = email.indexOf('@');
    let username = email.slice(0, atIndex);

    const slug = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    let uniqueSlug = slug;
    let counter = 1;
    const existingSlugs = await UserService.getExistingSlugs();

    while (existingSlugs.includes(uniqueSlug)) {
        uniqueSlug = `${slug}${counter}`;
        counter++;
    }

    return uniqueSlug;
}

export default generateUniqueSlug;