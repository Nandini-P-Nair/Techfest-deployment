const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const User = model('User', new Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
}, { timestamps: true }));

const Event = model('Event', new Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  category: { type: String, enum: ['Technical', 'Cultural', 'Workshop', 'Sports'], default: 'Technical' },
  venue: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  capacity: { type: Number, default: 100, min: 1 },
}, { timestamps: true }));

const regSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
}, { timestamps: true });
regSchema.index({ user: 1, event: 1 }, { unique: true }); // no double registration
const Registration = model('Registration', regSchema);

const Feedback = model('Feedback', new Schema({
  name: { type: String, required: true },
  message: { type: String, required: true, trim: true, maxlength: 500 },
  rating: { type: Number, min: 1, max: 5, default: 5 },
}, { timestamps: true }));

module.exports = { User, Event, Registration, Feedback };
