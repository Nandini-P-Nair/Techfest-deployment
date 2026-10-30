const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Reads the JWT from the httpOnly cookie
function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Please log in' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Session expired, please log in again' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  next();
}

// CSRF: a cross-site form cannot add a custom header, and a cross-site
// fetch with a custom header triggers a CORS preflight that we reject.
function csrfGuard(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('X-Requested-With') !== 'XMLHttpRequest') {
    return res.status(403).json({ message: 'CSRF check failed' });
  }
  next();
}

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
}

module.exports = { requireAuth, requireAdmin, csrfGuard, validate };
