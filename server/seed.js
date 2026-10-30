require('dotenv').config();
const mongoose = require('mongoose');
const { Event } = require('./models');

const d = (day, h) => new Date(`2026-11-${String(day).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00+05:30`);

const events = [
  { title: 'CodeSprint', category: 'Technical', venue: 'Lab Block A', date: d(12, 10), capacity: 80, description: 'Three hours, five problems, one leaderboard. Solo or pairs.' },
  { title: 'Hack the Campus', category: 'Technical', venue: 'Seminar Hall', date: d(12, 14), capacity: 120, description: '24-hour hackathon. Build something the campus can actually use.' },
  { title: 'Cloud in a Day', category: 'Workshop', venue: 'Room 204', date: d(13, 9), capacity: 60, description: 'Deploy a MERN app to the cloud with GitHub, Render and Netlify.' },
  { title: 'Robo Race', category: 'Technical', venue: 'Main Ground', date: d(13, 15), capacity: 40, description: 'Line-following robots race over a timed track.' },
  { title: 'Open Mic Night', category: 'Cultural', venue: 'Open Air Theatre', date: d(14, 18), capacity: 200, description: 'Music, stand-up and poetry. Five minutes each.' },
  { title: 'Inter-Dept Futsal', category: 'Sports', venue: 'Sports Complex', date: d(14, 16), capacity: 70, description: 'Five-a-side knockout between departments.' },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Event.deleteMany({});
  await Event.insertMany(events);
  console.log(`Seeded ${events.length} events`);
  await mongoose.disconnect();
})();
