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

app.post('/lobby', db.createLobby);

app.post('/acceptInvite', db.acceptInviteLobby)


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
  });