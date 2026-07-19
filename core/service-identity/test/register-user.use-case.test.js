import { jest, describe, it, expect } from '@jest/globals';
import { makeRegisterUser } from '../src/application/use-cases/register-user.use-case.js';
import { EmailAlreadyRegisteredError } from '../src/domain/errors/index.js';

describe('registerUser use-case', () => {
  it('creates a new user when the email is not taken', async () => {
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 'uuid-123', email: 'test@example.com', full_name: 'Test User' }),
    };
    const registerUser = makeRegisterUser({ userRepo, hashPassword: jest.fn().mockResolvedValue('hashed') });

    const result = await registerUser({ email: 'test@example.com', password: 'password123', fullName: 'Test User' });

    expect(result).toHaveProperty('id');
    expect(result.email).toBe('test@example.com');
    expect(userRepo.create).toHaveBeenCalledWith({ email: 'test@example.com', passwordHash: 'hashed', fullName: 'Test User' });
  });

  it('throws EmailAlreadyRegisteredError if the email already exists', async () => {
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue({ id: 'some-id' }),
      create: jest.fn(),
    };
    const registerUser = makeRegisterUser({ userRepo, hashPassword: jest.fn() });

    await expect(
      registerUser({ email: 'existing@example.com', password: 'password123', fullName: 'Existing User' }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
  });
});
