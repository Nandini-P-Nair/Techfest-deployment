const router = require('express').Router();
const { body, param } = require('express-validator');
const { Event, Registration } = require('../models');
const { requireAuth, requireAdmin, validate } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find().sort('date').lean();
    const counts = await Registration.aggregate([{ $group: { _id: '$event', n: { $sum: 1 } } }]);
    const map = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
    res.json(events.map((e) => ({ ...e, registered: map[String(e._id)] || 0 })));
  } catch (e) { next(e); }
});

// must come before /:id routes
router.get('/registrations/mine', requireAuth, async (req, res, next) => {
  try {
    const regs = await Registration.find({ user: req.user.id }).lean();
    res.json(regs.map((r) => String(r.event)));
  } catch (e) { next(e); }
});

router.post('/', requireAuth, requireAdmin,
  body('title').isString().trim().isLength({ min: 3, max: 100 }),
  body('description').isString().trim().isLength({ min: 5, max: 500 }),
  body('venue').isString().trim().notEmpty(),
  body('date').isISO8601(),
  body('category').optional().isIn(['Technical', 'Cultural', 'Workshop', 'Sports']),
  body('capacity').optional().isInt({ min: 1, max: 5000 }),
  validate,
  async (req, res, next) => {
    try {
      const { title, description, venue, date, category, capacity } = req.body;
      res.status(201).json(await Event.create({ title, description, venue, date, category, capacity }));
    } catch (e) { next(e); }
  });

router.post('/:id/register', requireAuth, param('id').isMongoId().withMessage('Invalid event id'), validate,
  async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      const taken = await Registration.countDocuments({ event: event._id });
      if (taken >= event.capacity) return res.status(409).json({ message: 'Event is full' });
      await Registration.create({ user: req.user.id, event: event._id });
      res.status(201).json({ message: 'Registered' });
    } catch (e) {
      if (e.code === 11000) return res.status(409).json({ message: 'Already registered' });
      next(e);
    }
  });

module.exports = router;
