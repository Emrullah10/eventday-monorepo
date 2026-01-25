const UserService = require('./user.service');
const jwt = require('jsonwebtoken');

/**
 * UserController - Maps HTTP requests to Service calls
 */
class UserController {
  async register(req, res) {
    try {
      const { email, password, fullName } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const user = await UserService.register({ email, password, fullName });

      // Generate token (Optional: auto-login after register)
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.status(201).json({
        message: 'User registered successfully',
        user,
        token
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await UserService.login(email, password);

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.status(200).json({
        message: 'Login successful',
        user,
        token
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
