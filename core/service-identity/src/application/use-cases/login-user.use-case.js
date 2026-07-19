import { InvalidCredentialsError } from '../../domain/errors/index.js';

export const makeLoginUser = ({ userRepo, comparePassword }) => async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new InvalidCredentialsError();

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) throw new InvalidCredentialsError();

  const { password_hash: _passwordHash, ...safeUser } = user;
  return safeUser;
};
