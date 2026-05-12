const express  = require('express');
const router   = express.Router();
const db       = require('../db/index');
const auth     = require('../middleware/auth');

// GET all projects for logged-in user
router.get('/', auth, async (req, res) => {
  const projects = await db.projects.find({ username: req.user.username });
  res.json(projects);
});

// CREATE a project
router.post('/', auth, async (req, res) => {
  const { name, description, status } = req.body;
  if (!name) return res.status(400).send("Project name required");
  const project = await db.projects.insert({
    username: req.user.username,
    name,
    description: description || '',
    status: status || 'active',
    createdAt: new Date()
  });
  res.json(project);
});

// UPDATE a project
router.put('/:id', auth, async (req, res) => {
  const { name, description, status } = req.body;
  const updated = await db.projects.update(
    { _id: req.params.id, username: req.user.username },
    { $set: { name, description, status } },
    { returnUpdatedDocs: true }
  );
  res.json(updated);
});

// DELETE a project
router.delete('/:id', auth, async (req, res) => {
  await db.projects.remove({ _id: req.params.id, username: req.user.username });
  res.json({ status: "deleted" });
});

module.exports = router;