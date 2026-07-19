import { ConflictError, UnauthorizedError } from '@everyday/errors';

export class EmailAlreadyRegisteredError extends ConflictError {
  constructor() {
    super('Email already registered');
  }
}

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super('Invalid credentials');
  }
}
