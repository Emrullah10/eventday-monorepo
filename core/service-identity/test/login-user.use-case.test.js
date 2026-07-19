import { jest, describe, it, expect } from '@jest/globals';
import bcrypt from 'bcryptjs';
import { makeLoginUser } from '../src/application/use-cases/login-user.use-case.js';
import { InvalidCredentialsError } from '../src/domain/errors/index.js';

describe('loginUser use-case', () => {
  it('returns the user (without password hash) on correct credentials', async () => {
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 10);
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue({ id: 'uuid-123', email: 'test@example.com', password_hash: passwordHash, full_name: 'Test' }),
    };
    const loginUser = makeLoginUser({ userRepo, comparePassword: bcrypt.compare });

    const result = await loginUser({ email: 'test@example.com', password });

    expect(result).toHaveProperty('id');
    expect(result.email).toBe('test@example.com');
    expect(result).not.toHaveProperty('password_hash');
  });

  it('throws InvalidCredentialsError if the user is not found', async () => {
    const userRepo = { findByEmail: jest.fn().mockResolvedValue(null) };
    const loginUser = makeLoginUser({ userRepo, comparePassword: bcrypt.compare });

    await expect(loginUser({ email: 'none@test.com', password: 'pass' })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('throws InvalidCredentialsError if the password is wrong', async () => {
    const passwordHash = await bcrypt.hash('real-pass', 10);
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue({ id: 'uuid-123', email: 'test@example.com', password_hash: passwordHash }),
    };
    const loginUser = makeLoginUser({ userRepo, comparePassword: bcrypt.compare });

    await expect(loginUser({ email: 'test@example.com', password: 'wrong-pass' })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
