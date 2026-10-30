const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { User } = require('../models');
const { requireAuth, validate } = require('../middleware/auth');

const isProd = process.env.NODE_ENV === 'production';

// Brute-force protection on login/register
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  skip: () => process.env.NODE_ENV === 'test',
  message: { message: 'Too many attempts, try again later' },
});

// Cookie flags: httpOnly (JS cannot read), secure (HTTPS only),
// sameSite (none is required because Netlify and Render are different sites)
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  maxAge: 2 * 60 * 60 * 1000,
  path: '/',
};

const emailRule = body('email').isString().withMessage('Email must be text')
  .bail().trim().isEmail().withMessage('Enter a valid email').bail().customSanitizer((v) => v.toLowerCase());
const passwordRule = body('password').isString().withMessage('Password must be text')
  .bail().isLength({ min: 8, max: 72 }).withMessage('Password must be 8-72 characters');

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

router.post('/register', limiter,
  body('name').isString().trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
  emailRule, passwordRule, validate,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered' });
      const role = process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.toLowerCase() === email ? 'admin' : 'student';
      const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role });
      res.status(201).json({ user: publicUser(user) });
    } catch (e) { next(e); }
  });

router.post('/login', limiter, emailRule, passwordRule, validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      const ok = user && await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ message: 'Invalid email or password' });
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
      res.cookie('token', token, cookieOptions).json({ user: publicUser(user) });
    } catch (e) { next(e); }
  });

router.post('/logout', (req, res) => {
  res.clearCookie('token', { ...cookieOptions, maxAge: undefined }).json({ message: 'Logged out' });
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'Please log in' });
    res.json({ user: publicUser(user) });
  } catch (e) { next(e); }
});

module.exports = router;
