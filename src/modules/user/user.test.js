const UserService = require('./user.service');
const { pool } = require('../../common/database');

// Mocking the database
jest.mock('../../common/database', () => ({
  query: jest.fn(),
  pool: {
    query: jest.fn(),
  },
}));

describe('UserService (Auth Module)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      };

      const mockDbResponse = {
        rows: [{ id: 'uuid-123', email: mockUser.email, full_name: mockUser.fullName }]
      };

      // Mocking user check (empty result) and insertion
      require('../../common/database').query
        .mockResolvedValueOnce({ rows: [] }) // Check existence
        .mockResolvedValueOnce(mockDbResponse); // Insert

      const result = await UserService.register(mockUser);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw error if email already exists', async () => {
      const mockUser = {
        email: 'existing@example.com',
        password: 'password123',
        fullName: 'Existing User'
      };

      require('../../common/database').query.mockResolvedValueOnce({ rows: [{ id: 'some-id' }] });

      await expect(UserService.register(mockUser)).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('should return user if credentials are correct', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const passwordHash = await require('bcryptjs').hash(password, 10);

      const mockUser = { id: 'uuid-123', email, password_hash: passwordHash, full_name: 'Test' };

      require('../../common/database').query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await UserService.login(email, password);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe(email);
    });

    it('should throw error if user not found', async () => {
      require('../../common/database').query.mockResolvedValueOnce({ rows: [] });

      await expect(UserService.login('none@test.com', 'pass')).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password incorrect', async () => {
      const email = 'test@example.com';
      const passwordHash = await require('bcryptjs').hash('real-pass', 10);
      const mockUser = { id: 'uuid-123', email, password_hash: passwordHash };

      require('../../common/database').query.mockResolvedValueOnce({ rows: [mockUser] });

      await expect(UserService.login(email, 'wrong-pass')).rejects.toThrow('Invalid credentials');
    });
  });
});
