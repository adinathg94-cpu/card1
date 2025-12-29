import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d"; // 7 days

export interface TokenPayload {
    userId: number;
    username: string;
    iat?: number;
    exp?: number;
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(userId: number, username: string): string {
    return jwt.sign(
        { userId, username } as TokenPayload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}
