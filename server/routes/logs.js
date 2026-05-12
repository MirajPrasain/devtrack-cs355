const express  = require('express');
const router   = express.Router();
const db       = require('../db/index');
const auth     = require('../middleware/auth');

// GET all logs for logged-in user
router.get('/', auth, async (req, res) => {
  const logs = await db.logs.find({ username: req.user.username });
  res.json(logs);
});

// CREATE a new log
router.post('/', auth, async (req, res) => {
  const { date, hours, tasks, notes } = req.body;
  if (!date || !hours) return res.status(400).send("Date and hours required");
  const log = await db.logs.insert({
    username: req.user.username,
    date,
    hours,
    tasks: tasks || '',
    notes: notes || '',
    createdAt: new Date()
  });
  res.json(log);
});

// UPDATE a log
router.put('/:id', auth, async (req, res) => {
  const { date, hours, tasks, notes } = req.body;
  const updated = await db.logs.update(
    { _id: req.params.id, username: req.user.username },
    { $set: { date, hours, tasks, notes } },
    { returnUpdatedDocs: true }
  );
  res.json(updated);
});

// DELETE a log
router.delete('/:id', auth, async (req, res) => {
  await db.logs.remove({ _id: req.params.id, username: req.user.username });
  res.json({ status: "deleted" });
});

module.exports = router;