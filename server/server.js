require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const http    = require('http');

const app    = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const authRoutes      = require('./routes/auth');
const logRoutes       = require('./routes/logs');
const projectRoutes   = require('./routes/projects');
const signalingRoutes = require('./routes/signaling');

app.use('/api/auth',     authRoutes);
app.use('/api/logs',     logRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/signal',   signalingRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`DevTrack running on http://localhost:${PORT}`);
});