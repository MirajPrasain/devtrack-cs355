# DevTrack

A full-stack web application for tracking coding sessions, managing projects, and measuring development progress over time.

## Live Demo

[https://devtrack.onrender.com](https://devtrack.onrender.com)

## Features

- **Authentication** — Register and login with bcrypt-hashed passwords and JWT tokens
- **Coding Logs** — Create, read, update, and delete daily coding session logs (date, hours, tasks, notes)
- **Project Tracker** — Manage multiple projects with status tracking (active, paused, completed)
- **Protected Routes** — All data routes require a valid JWT token via Authorization header
- **PWA** — Installable as a desktop/mobile app with offline dashboard support via service worker
- **WebRTC Pair Session** — Peer-to-peer video/audio coding sessions using WebRTC with a lightweight signaling server

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | NeDB (file-based, no install required) |
| Auth | bcryptjs, JSON Web Tokens (JWT) |
| Realtime | WebRTC (RTCPeerConnection), STUN server |
| PWA | Web App Manifest, Service Worker |
| Deploy | Render |

## Project Structure

```
devtrack/
├── server/
│   ├── server.js              # Express entry point
│   ├── routes/
│   │   ├── auth.js            # POST /api/auth/register, /api/auth/login
│   │   ├── logs.js            # GET/POST/PUT/DELETE /api/logs
│   │   ├── projects.js        # GET/POST/PUT/DELETE /api/projects
│   │   └── signaling.js       # WebRTC signaling (offer/answer/ICE)
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   └── db/
│       └── index.js           # NeDB datastore initialization
├── public/
│   ├── index.html             # Login / Register page
│   ├── dashboard.html         # Main app dashboard
│   ├── pair.html              # WebRTC pair session page
│   ├── css/style.css          # Global styles
│   ├── js/
│   │   ├── auth.js            # Login/register frontend logic
│   │   ├── logs.js            # Logs CRUD frontend
│   │   ├── projects.js        # Projects CRUD frontend
│   │   └── rtc.js             # WebRTC peer connection logic
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker (offline caching)
├── .env                       # Environment variables (not in repo)
├── .gitignore
└── package.json
```

## Running Locally

**Prerequisites:** Node.js installed

**1. Clone the repo**
```bash
git clone https://github.com/MirajPrasain/devtrack.git
cd devtrack
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env` file**
```
JWT_SECRET=your_secret_key_here
PORT=3000
```

**4. Start the server**
```bash
node server/server.js
```

**5. Open in browser**
```
http://localhost:3000
```

## API Endpoints

### Auth
| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |

### Logs
| Method | Route | Description | Auth Required |
|---|---|---|---|
| GET | `/api/logs` | Get all logs for current user | Yes |
| POST | `/api/logs` | Create a new log | Yes |
| PUT | `/api/logs/:id` | Update a log | Yes |
| DELETE | `/api/logs/:id` | Delete a log | Yes |

### Projects
| Method | Route | Description | Auth Required |
|---|---|---|---|
| GET | `/api/projects` | Get all projects for current user | Yes |
| POST | `/api/projects` | Create a new project | Yes |
| PUT | `/api/projects/:id` | Update a project | Yes |
| DELETE | `/api/projects/:id` | Delete a project | Yes |

### Signaling (WebRTC)
| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | `/api/signal/:type/:sessionId` | Store offer/answer/ICE | Yes |
| GET | `/api/signal/:type/:sessionId` | Retrieve offer/answer/ICE | Yes |

## How Authentication Works

1. On register, the password is hashed using `bcrypt` with 10 salt rounds before being stored in NeDB
2. On login, `bcrypt.compare()` checks the plain password against the stored hash
3. If valid, a JWT is signed with `JWT_SECRET` and returned to the client
4. The client stores the token in `localStorage` and sends it in the `Authorization: Bearer <token>` header on every protected request
5. The `authenticateToken` middleware verifies the token and attaches the decoded user to `req.user`

## How WebRTC Works

1. Caller enters a session ID and clicks **Start Call** — creates an SDP offer and posts it to the signaling server
2. Callee enters the same session ID and clicks **Join Call** — fetches the offer, creates an answer, posts it back
3. Both peers exchange ICE candidates via the signaling server
4. Once ICE negotiation completes, media flows directly peer-to-peer using Google's public STUN server

## How PWA Works

- `manifest.json` defines the app name, icons, theme color, and start URL
- `sw.js` (service worker) caches core assets on install and serves them from cache when offline
- Chrome/Edge shows an install prompt when visiting the app — click to install as a standalone desktop app

## Deployment

Deployed on Render as a Node.js web service. Environment variables (`JWT_SECRET`) are set in the Render dashboard. NeDB creates database files automatically on first run.