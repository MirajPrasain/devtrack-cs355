const express = require('express');
const router  = express.Router();
const db      = require('../db/index');
const auth    = require('../middleware/auth');

// store a signal (offer, answer, or ice)
router.post('/:type/:sessionId', auth, async (req, res) => {
  const { type, sessionId } = req.params;
  await db.signals.remove({ sessionId, type }, { multi: true });
  await db.signals.insert({ sessionId, type, data: req.body.data });
  res.json({ ok: true });
});

// retrieve a signal
router.get('/:type/:sessionId', auth, async (req, res) => {
  const { type, sessionId } = req.params;
  const doc = await db.signals.findOne({ sessionId, type });
  res.json(doc || {});
});

module.exports = router;