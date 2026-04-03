export function roleMiddleware(...roles) {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (err) {
      console.error('error in roleMiddleware', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
}
