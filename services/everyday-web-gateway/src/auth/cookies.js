import { appConfig } from '../../configs/app-config.js';

export const ACCESS_COOKIE = 'everyday_access_token';

const isProd = appConfig.NODE_ENV === 'production';

export const setAccessCookie = (res, token) => {
  res.cookie(ACCESS_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    signed: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const clearAccessCookie = (res) => {
  res.clearCookie(ACCESS_COOKIE, { httpOnly: true, secure: isProd, sameSite: 'lax', signed: true });
};

export const readAccessCookie = (req) => req.signedCookies?.[ACCESS_COOKIE];
