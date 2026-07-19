export const requireIdentityHeaders = (req, res, next) => {
  const id = req.header('x-user-id');
  const role = req.header('x-user-role');
  if (!id) {
    return res.status(401).json({ message: 'Missing authenticated user context' });
  }
  req.user = { id, role };
  next();
};
