exports.authenticateSession = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Please log in to access the cart." });
  }
  next();
};