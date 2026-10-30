const router = require('express').Router();
const { body } = require('express-validator');
const { Feedback, User } = require('../models');
const { requireAuth, validate } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    res.json(await Feedback.find().sort('-createdAt').limit(20).lean());
  } catch (e) { next(e); }
});

// The message is stored as plain text. React renders it as text (not HTML),
// so <script> tags are shown literally and never executed.
router.post('/', requireAuth,
  body('message').isString().trim().isLength({ min: 1, max: 500 }).withMessage('Message must be 1-500 characters'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  validate,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      const fb = await Feedback.create({ name: user.name, message: req.body.message, rating: req.body.rating || 5 });
      res.status(201).json(fb);
    } catch (e) { next(e); }
  });

module.exports = router;
