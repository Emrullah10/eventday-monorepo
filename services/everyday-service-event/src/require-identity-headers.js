/**
 * Trusts x-user-id / x-user-role headers set by the gateway after it verified
 * the caller's JWT. This service is never exposed directly to the internet
 * (only reachable through the gateway/docker network), so no signature
 * re-verification happens here — see MONOREPO-ARCHITECTURE-TEMPLATE.md §5.
 */
export const requireIdentityHeaders = (req, res, next) => {
  const id = req.header('x-user-id');
  const role = req.header('x-user-role');
  if (!id) {
    return res.status(401).json({ message: 'Missing authenticated user context' });
  }
  req.user = { id, role };
  next();
};
