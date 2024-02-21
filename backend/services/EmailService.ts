import NodeMailer from 'nodemailer';

const transporter = NodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_SMTP_USER,
        pass: process.env.GOOGLE_SMTP_PASSWORD
    }
});

class EmailService {
    public async sendPasswordResetToken(email: string, token: string) {
        const message = {
            from: 'Substantia',
            to: email,
            subject: 'Twój link do zresetowania hasła',
            text: `Witaj, Twój link do zresetowania hasła do konta na platformie Substantia: ${process.env.FRONTEND_URL}/password-reset?token=${token}`
        }
        await transporter.sendMail(message);
    }
}

export default new EmailService();