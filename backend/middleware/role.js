module.exports = function(requiredRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (!req.user.role) return res.status(403).json({ message: 'No role assigned' });
    if (req.user.role !== requiredRole && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
