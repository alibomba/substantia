import { OAuth2Client } from "google-auth-library";
const authClient = new OAuth2Client();

class GoogleService {
    public async getGoogleUser(token: string) {
        const ticket = await authClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const user = ticket.getPayload();
        if (!user) throw new Error('Token nieprawidłowy', { cause: 'AUTHORIZATION' });
        return user;
    }
}

export default new GoogleService();