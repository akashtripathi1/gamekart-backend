export const isAuthenticated = (req, res, next) => {
if (req.isAuthenticated()) {
    return next();
  }
  // Optionally, redirect to login or send an error
  res.status(401).json({ message: "Unauthorized: Please log in first" });
  // Or, for traditional web apps, use:
  // res.redirect('/login');
}

export const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') return next();
  res.status(403).json({ error: 'Admins only' });
};

export const isRider = (req, res, next) => {
  if (req.user.role === 'rider') return next();
  res.status(403).json({ error: 'Riders only' });
};
