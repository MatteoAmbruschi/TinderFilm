if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const db = require('./queries');

const app = express();
const port = process.env.PORT || 3000;


const origin = [
    'http://localhost:3001',
    'http://localhost:3001/',
    'http://localhost:3000',
    'http://localhost:3000/',
    'http://localhost:5173/',
    'http://localhost:5173',
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


app.get('/', (req, res) => {
  db.getMovie('https://api.themoviedb.org/3/authentication', res);
});

app.get('/getMovieTypes', (req, res) => {
  db.getMovie('https://api.themoviedb.org/3/genre/movie/list?language=en', res);
});


app.post('/getMovieGenre/:lobbyId', (req, res) => {
  console.log('Lobby ID:', req.params.lobbyId);
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

app.put('/checkMatch', db.checkMatch)
app.put('/checkMatchLike', db.checkMatchLike)


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
  });


/*   `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_KEY}&with_genre=${selectedGenre}`; */