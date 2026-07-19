import rateLimit from 'express-rate-limit';

/** Tight limiter for auth endpoints (register/login) — brute-force protection. */
export const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later.' },
});
