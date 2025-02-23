// jwt.utils.ts (or wherever verifyAuthToken is)
import jwt, { JwtPayload } from 'jsonwebtoken';

export function verifyAuthToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as JwtPayload;
  } catch (error) {
    return null;
  }
}