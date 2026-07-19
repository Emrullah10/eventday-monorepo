import { EmailAlreadyRegisteredError } from '../../domain/errors/index.js';

export const makeRegisterUser = ({ userRepo, hashPassword }) => async ({ email, password, fullName }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new EmailAlreadyRegisteredError();

  const passwordHash = await hashPassword(password);
  return userRepo.create({ email, passwordHash, fullName });
};
