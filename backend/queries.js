if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
const fetch = require('node-fetch');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT_POOL,
/*     ssl: {
        rejectUnauthorized: false
    } */
})


const getMovie = (url, res) => {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + process.env.TMDB_TOKEN
        }
    };
    
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            res.status(200).send(data); // Invia i dati al client
        })
        .catch(err => {
            console.error('error:' + err);
            res.status(500).json({ error: 'Errore durante la richiesta al server' }); // Invia un errore al client
        });
};


const getMovieType = (url, lobbyId, page, res) => {
  pool.query(
    'SELECT type_id FROM lobby WHERE id = $1',
    [lobbyId],
    (err, result) => {
      if (err) {
        console.error('Error fetching genre ID:', err);
        return res.status(500).json({ error: 'Error fetching genre ID' });
      }

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Lobby not found' });
      }

      const type_id = result.rows[0].type_id;

      const genreUrl = `${url}?with_genres=${type_id}&page=${page}&api_key=${process.env.TMDB_KEY}`;

      fetch(genreUrl)
        .then(response => response.json())
        .then(data => {
          /* console.log(data); */
          res.status(200).send(data); // Send the data to the client
        })
        .catch(err => {
          console.error('Error fetching movies:', err);
          res.status(500).json({ error: 'Error fetching movies from the API' }); // Send an error to the client
        });
    }
  );
};


const createLobby = (req, res) => {
    const { type, type_id, name } = req.body;

    pool.query(
        'INSERT INTO lobby (type, type_id) VALUES ($1, $2) RETURNING *',
        [type, type_id],
        (err, result) => {
          if (err) {
            console.error('Error crating lobby', err);
            res.status(500).json({ error: 'Error crating lobby' });
            return;
          }
          else {
        pool.query('INSERT INTO users (name, lobby_id) VALUES ($1, $2) RETURNING *',
        [name, result.rows[0].id],
        (err, result) => {
            if (err) {
                console.error('Error crating lobby', err);
                res.status(500).json({ error: 'Error crating lobby' });
                return;
              }
            res.status(200).json(result.rows[0]);
        })
          }
        }
      );
}


const acceptInviteLobby = (req, res) => {
  const { name, lobby_id } = req.body;


      pool.query('INSERT INTO users (name, lobby_id) VALUES ($1, $2) RETURNING *',
      [name, lobby_id],
      (err, result) => {
          if (err) {
              console.error('Error crating lobby', err);
              res.status(500).json({ error: 'Error crating lobby' });
              return;
            }
          res.status(200).json(result.rows[0]);
      });
}

const getInfo = (lobbyId, res) => {
  pool.query(
    'SELECT * FROM lobby WHERE id = $1',
    [lobbyId],
    (err, result) => {
      if (err) {
        console.error('Error fetching genre ID:', err);
        return res.status(500).json({ error: 'Error fetching genre ID' });
      }

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Lobby not found' });
      }

      console.log(result.rows[0])
      res.status(200).json(result.rows[0]);
    }
  );
}


module.exports = {
    getMovie,
    createLobby,
    acceptInviteLobby,
    getMovieType,
    getInfo
}