import bcrypt from 'bcryptjs';
import { makeUserRepository } from './infrastructure/persistence/repositories/user.repository.js';
import { makeRegisterUser } from './application/use-cases/register-user.use-case.js';
import { makeLoginUser } from './application/use-cases/login-user.use-case.js';
import { makeFindUserById } from './application/use-cases/find-user-by-id.use-case.js';
import { wrapWithHttpTranslation } from './interfaces/http/translate-domain-error.js';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Builds the identity domain's use-cases wired to a concrete `rawQuery`.
 * This is the piece services/everyday-service-identity/src/container.js
 * imports and calls — the composition root lives in the service shell, this
 * module just exposes framework-free factories (see MONOREPO-ARCHITECTURE-TEMPLATE.md §3.2).
 */
export const buildIdentityCore = ({ rawQuery, translateHttpErrors = true }) => {
  const userRepo = makeUserRepository({ rawQuery });
  const wrap = translateHttpErrors ? wrapWithHttpTranslation : (fn) => fn;

  return {
    registerUser: wrap(makeRegisterUser({ userRepo, hashPassword })),
    loginUser: wrap(makeLoginUser({ userRepo, comparePassword: bcrypt.compare })),
    findUserById: wrap(makeFindUserById({ userRepo })),
  };
};

export { makeUserRepository } from './infrastructure/persistence/repositories/user.repository.js';
