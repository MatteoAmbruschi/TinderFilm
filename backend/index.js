if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
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
    'https://tinder-film-backend.vercel.app',
    'https://tinder-film-backend.vercel.app/'
]

const corsOptions = {
    origin,
    optionsSuccessStatus: 200,
    credentials: true
  }

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use((req, res, next) => {
  req.body.io = io
  next()
})


app.post('/set-cookie', (req, res) => {
  const cookies = req.body.cookies;

  res.cookie('name', JSON.stringify(cookies), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // True solo in produzione
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).send('Cookie is set');
});

app.get('/read-cookie', (req, res) => {
  let userCookie;
  try {
    userCookie = req.cookies.name ? JSON.parse(req.cookies.name) : null;
  } catch (err) {
    console.error("Invalid cookie format", err);
    userCookie = null;
  }
  console.log('cookie:', userCookie);
  res.send({cookie: userCookie});
});

app.get('/deleteCookies', (req, res) => {
  res.clearCookie('name', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).send('Cookie deleted');
});


app.get('/', (req, res) => {
  db.getMovie('https://api.themoviedb.org/3/authentication', res);
});

app.get('/getMovieTypes', (req, res) => {
  db.getMovie('https://api.themoviedb.org/3/genre/movie/list?language=en', res);
});


app.post('/getMovieGenre/:lobbyId', (req, res) => {
  /* console.log('Lobby ID:', req.params.lobbyId); */
  const lobbyId = parseInt(req.params.lobbyId, 10);
  const page = req.body.page || 1;
  console.log(page)

  if (!lobbyId || isNaN(lobbyId)) {
    return res.status(400).json({ error: 'lobbyId is required' });
  }

  db.getMovieType('https://api.themoviedb.org/3/discover/movie', lobbyId, page, res);
});

app.post('/lobby', db.createLobby);

app.post('/acceptInvite', db.acceptInviteLobby)

app.get('/getInfo/:lobbyId', (req, res) => {
  const lobbyId = parseInt(req.params.lobbyId, 10);

  if (!lobbyId || isNaN(lobbyId)) {
    return res.status(400).json({ error: 'lobbyId is required' });
  }

  db.getInfo(lobbyId, res)
})


app.post('/selectedMovie', db.selectedMovie)
app.put('/undoSwipe', db.undoSwipe)
app.put('/removeMatch', db.removeMatch)

app.put('/checkMatch', db.checkMatch)

app.put('/checkMatchLike', db.checkMatchLike)


/* setInterval(() => {
  io.emit('test_event', { message: 'This is a test' });
}, 5000);
 */

/* app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
  }); */
  
  server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });


/*   `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_KEY}&with_genre=${selectedGenre}`; */