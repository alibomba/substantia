import { JwtPayload } from "jsonwebtoken";

interface MyJWTPayload extends JwtPayload {
    id: string,
    email: string,
    username: string,
    avatar: string | null,
    slug: string,
    hasChannel: boolean
}

export default MyJWTPayload;