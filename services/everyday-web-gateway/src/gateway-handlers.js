import { identityClient } from './identity-client.js';
import { signAccessToken } from './auth/jwt.js';
import { setAccessCookie, clearAccessCookie } from './auth/cookies.js';

/** Forwards an upstream axios error's status/body, or falls back to 502. */
const forwardUpstreamError = (res, error) => {
  if (error.response) {
    return res.status(error.response.status).json(error.response.data);
  }
  res.status(502).json({ message: 'Upstream service unavailable' });
};

export const makeGatewayHandlers = () => ({
  register: async (req, res) => {
    try {
      const { email, password, fullName } = req.body;
      if (!email || !password || !fullName) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const user = await identityClient.register({ email, password, fullName });
      const token = signAccessToken(user);
      setAccessCookie(res, token);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      forwardUpstreamError(res, error);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const user = await identityClient.login({ email, password });
      const token = signAccessToken(user);
      setAccessCookie(res, token);
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      forwardUpstreamError(res, error);
    }
  },

  logout: async (req, res) => {
    clearAccessCookie(res);
    res.json({ message: 'Logged out' });
  },

  me: async (req, res) => {
    try {
      const user = await identityClient.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ user });
    } catch (error) {
      forwardUpstreamError(res, error);
    }
  },
});
