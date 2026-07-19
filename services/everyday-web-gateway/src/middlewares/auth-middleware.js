import { readAccessCookie, ACCESS_COOKIE } from '../auth/cookies.js';
import { verifyAccessToken } from '../auth/jwt.js';

/** Reads the signed access cookie, verifies it, and attaches req.user. */
export const authMiddleware = (req, res, next) => {
  const token = readAccessCookie(req) ?? req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.clearCookie(ACCESS_COOKIE);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

/** Attaches req.user if a valid token is present, but never rejects the request. */
export const optionalAuthMiddleware = (req, res, next) => {
  const token = readAccessCookie(req) ?? req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      req.user = verifyAccessToken(token);
    } catch {
      // ignore — treated as anonymous
    }
  }
  next();
};
