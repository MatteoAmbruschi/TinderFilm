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
            /* console.log(data); */
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

      /* console.log(result.rows[0]) */
      res.status(200).json(result.rows[0]);
    }
  );
}

const selectedMovie = (req, res) => {
  const movie = req.body.data.movie
  const idUser = req.body.data.idUser

  pool.query(`
    UPDATE users 
    SET movie_selected = 
      CASE 
        WHEN movie_selected IS NULL THEN ARRAY[$1] 
        ELSE array_append(movie_selected, $1) 
      END 
    WHERE id = $2 
    RETURNING *;
    `,
      [movie.id, idUser],
      (err, result) => {
          if (err) {
              console.error('Error crating lobby', err);
              res.status(500).json({ error: 'Error crating lobby' });
              return;
            }
          res.status(200).json(result.rows[0]);
      });
}

const undoSwipe = (req, res) => {
  const idUser = req.body.data.idUser

  pool.query( `
    UPDATE users 
    SET movie_selected = 
      CASE 
        WHEN array_length(movie_selected, 1) IS NOT NULL THEN array_remove(movie_selected, movie_selected[array_length(movie_selected, 1)]) 
        ELSE movie_selected 
      END 
    WHERE id = $1 
    RETURNING *;
    `,
      [idUser],
      (err, result) => {
          if (err) {
              console.error('Error crating lobby', err);
              res.status(500).json({ error: 'Error crating lobby' });
              return;
            }
          res.status(200).json(result.rows[0]);
      });
}



const movieById = async (movieId) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + process.env.TMDB_TOKEN 
    }
  };

  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, options);
    const data = await response.json();
    return data; 
  } catch (err) {
    console.error('Error fetching movie data:', err);
    throw new Error('Errore durante la richiesta al server');
  }
};


const checkMatch = (req, res) => {
  const idApp = req.body.idApp
  console.log('ID APP:', idApp)
  
  pool.query(`
      WITH all_selected_movies AS (
        SELECT unnest(users.movie_selected) AS movie_id
        FROM users
        WHERE users.lobby_id = $1
      ),
      common_movies AS (
        SELECT movie_id
        FROM all_selected_movies
        GROUP BY movie_id
        HAVING COUNT(*) = (SELECT COUNT(*) FROM users WHERE lobby_id = $1)
      )

      UPDATE lobby
      SET match = array(SELECT movie_id FROM common_movies)
      WHERE lobby.id = $1
      RETURNING *;
      `,
      [idApp],
      async (err, result) => {
        if (result.rows.length > 0 && result.rows[0].match.length > 0) {
          const movieIds = result.rows[0].match;

          try {
              const moviesData = await Promise.all(movieIds.map(movieById));
              console.log(moviesData)
              return res.status(200).send(moviesData); // Invia i dati dei film al client
          } catch (error) {
              return res.status(500).json({ error: error.message });
          }
      } else {
          return res.status(200).json({ message: 'No common movies found' });
      }
      });
}



const checkMatchLike = async (req, res) => {
  try {
    const idApp = req.body.dataMatch.idApp;
    const movie = req.body.dataMatch.movie.id;

    pool.query(`
      SELECT movie_selected 
      FROM users 
      WHERE lobby_id = $1
      `,
      [idApp],
      (err, result) => {
      if (err) {
        console.error('Error crating lobby', err);
        res.status(500).json({ error: 'Error crating lobby' });
        return;
      }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No lobby found for this application ID" });
    }

    let allMovieSelections = [];
    if (result.rows.length > 0) {
      for (let i = 0; i < result.rows.length; i++) {
        allMovieSelections = allMovieSelections.concat(result.rows[i].movie_selected);
      }
    }

    const matchingMovies = allMovieSelections.filter(id => id == movie);
    const matchingMoviesBoolean = matchingMovies.length === result.rows.length

    if(matchingMoviesBoolean === true) {
      pool.query(`
          UPDATE lobby
          SET match = array_append(match, $1)
          WHERE id = $2
          RETURNING *
        `,
        [movie, idApp],
        (err, result) => {
          if (err) {
                console.error('Error updating lobby match', err);
                return res.status(500).json({ error: 'Error updating lobby match' });
              }

              console.log('Updated lobby:', movie);
              return res.status(200).json({ match: movie });
            });
          } else {
            console.log({ match: null })
            return res.status(200).json({ match: null });
          }
       })
        }catch (error) {
          console.error("Error checking match:", error);
          res.status(500).json({ error: "Internal server error" });
        }
          };



module.exports = {
    getMovie,
    createLobby,
    acceptInviteLobby,
    getMovieType,
    getInfo,
    selectedMovie,
    undoSwipe,
    checkMatch,
    checkMatchLike
}