/**
 * The original monolith flagged /sync as "should be admin only, ideally a
 * CRON job" but never enforced it. Enforcing the role here closes that gap
 * (see MONOREPO-ARCHITECTURE-TEMPLATE.md §5 for why the gateway is trusted
 * to have already verified the JWT before setting these headers).
 */
export const requireAdminHeaders = (req, res, next) => {
  const id = req.header('x-user-id');
  const role = req.header('x-user-role');
  if (!id) return res.status(401).json({ message: 'Missing authenticated user context' });
  if (role !== 'ADMIN') return res.status(403).json({ message: 'Admin role required' });
  next();
};
