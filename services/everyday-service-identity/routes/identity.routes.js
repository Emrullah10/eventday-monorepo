import { Router } from 'express';

/**
 * Public HTTP surface for identity: register/login return the user object.
 * Token issuance is NOT here — that's the gateway's job (see
 * MONOREPO-ARCHITECTURE-TEMPLATE.md §5), so this service only ever proves
 * credentials or looks up a user by id.
 */
export const makeIdentityRoutes = ({ registerUser, loginUser, findUserById }) => {
  const router = Router();

  router.post('/register', async (req, res, next) => {
    try {
      const { email, password, fullName } = req.body;
      if (!email || !password || !fullName) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const user = await registerUser({ email, password, fullName });
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const user = await loginUser({ email, password });
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  });

  router.get('/internal/users/:id', async (req, res, next) => {
    try {
      const user = await findUserById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
