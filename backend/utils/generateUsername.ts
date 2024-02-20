function generateUsername(email: string) {
    const atIndex = email.indexOf('@');
    let username = email.slice(0, atIndex);

    const parts = username.split(/[^a-zA-Z0-9]+/);

    const capitalizedParts = parts.map(part => {
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });

    const pascalCaseUsername = capitalizedParts.join('');
    return pascalCaseUsername;
}

export default generateUsername;