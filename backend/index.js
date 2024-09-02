if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const db = require('./queries');

const app = express();

const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_URL, // Your frontend URL
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
});

const port = process.env.PORT || 3001;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_lobby', (idApp) => {
    socket.join(`lobby_${idApp}`);
    console.log(`User ${socket.id} joined ${idApp}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const origin = [
  process.env.NEXT_PUBLIC_URL,
  process.env.NEXT_PUBLIC_BACKEND,
  'http://localhost:3001',
  'http://localhost:3001/',
  'http://localhost:3000',
  'http://localhost:3000/',
  'http://localhost:5173/',
  'http://localhost:5173',
  'https://tinder-film.vercel.app',
  'https://tinder-film.vercel.app/',
  'https://tinder-film-backend.vercel.app',
  'https://tinder-film-backend.vercel.app/',
  'https://tinderfilm.onrender.com',
  'https://tinderfilm.onrender.com/',
];

const corsOptions = {
  origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000, // Check expired sessions every 24 hours
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production', // Secure only in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  req.body.io = io;
  next();
});

app.post('/set-cookie', (req, res) => {
  const cookies = req.body.cookies;

  req.session.userData = cookies; // Store user data in session

  res.cookie('name', JSON.stringify(cookies), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).send('Cookie is set');
});

app.get('/read-cookie', (req, res) => {
  let userCookie;
  try {
    userCookie = req.session.userData || null; // Retrieve session data
  } catch (err) {
    console.error("Invalid session data", err);
    userCookie = null;
  }
  console.log('cookie:', userCookie);
  res.send({ cookie: userCookie });
});

app.get('/deleteCookies', (req, res) => {
  res.clearCookie('name', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  req.session.destroy(); // Destroy session data
  res.status(200).send('Cookie and session deleted');
});

app.get('/', (req, res) => {
  db.getMovie('https://api.themoviedb.org/3/authentication', res);
});

app.get('/getMovieTypes', (req, res) => {
  db.getMovie('https://api.themoviedb.org/3/genre/movie/list?language=en', res);
});

app.post('/getMovieGenre/:lobbyId', (req, res) => {
  const lobbyId = parseInt(req.params.lobbyId, 10);
  const page = req.body.page || 1;

  if (!lobbyId || isNaN(lobbyId)) {
    return res.status(400).json({ error: 'lobbyId is required' });
  }

  db.getMovieType('https://api.themoviedb.org/3/discover/movie', lobbyId, page, res);
});

app.post('/lobby', db.createLobby);

app.post('/acceptInvite', db.acceptInviteLobby);

app.get('/getInfo/:lobbyId', (req, res) => {
  const lobbyId = parseInt(req.params.lobbyId, 10);

  if (!lobbyId || isNaN(lobbyId)) {
    return res.status(400).json({ error: 'lobbyId is required' });
  }

  db.getInfo(lobbyId, res);
});

app.post('/selectedMovie', db.selectedMovie);
app.put('/undoSwipe', db.undoSwipe);
app.put('/removeMatch', db.removeMatch);
app.put('/checkMatch', db.checkMatch);
app.put('/checkMatchLike', db.checkMatchLike);

server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
