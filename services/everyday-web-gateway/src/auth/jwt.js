import jwt from 'jsonwebtoken';
import { appConfig } from '../../configs/app-config.js';

export const signAccessToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, appConfig.JWT_SECRET, { expiresIn: appConfig.JWT_EXPIRES_IN });

export const verifyAccessToken = (token) => jwt.verify(token, appConfig.JWT_SECRET);
