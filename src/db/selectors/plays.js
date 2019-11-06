const playsColumnsNames = [
  'date',
  'duration',
  'game_id',
  'event_id'
];

const playsUsersColumnsNames = [
  'score',
  'is_winner',
  'user_id',
  'play_id'
];

const getPlaysByUserId = function (db, userId) {
  return db.query(`SELECT plays.*
   FROM plays_users JOIN plays ON plays_users.play_id = plays.id
   WHERE plays_users.user_id = $1`, [userId])
    .then(res => res.rows);
};


const getPlaysStatistics = function (db, gameId, isWinner, users, excludedUserId) {
  const values = [gameId, excludedUserId];
  let winnerCheck = '';
  if (isWinner === false) {
    winnerCheck = 'AND plays_users.is_winner = FALSE';
  }
  if (isWinner === true) {
    winnerCheck = 'AND plays_users.is_winner = TRUE';
  }
  let usersCondition = '';
  if (users) {
    usersCondition = `AND plays_users.user_id = ANY($3::int[])`;
    values.push(users);
  }
  return db.query(`SELECT
    MAX(plays_users.score) AS max_score, 
    MIN(plays_users.score) AS min_score,
    count(plays.game_id) as play_counts, 
    AVG(plays_users.score) AS avg_score,
    AVG(plays.duration) AS avg_duration 
    FROM plays_users JOIN plays ON plays_users.play_id = plays.id
    WHERE plays.game_id = $1 AND plays_users.user_id != $2 ${winnerCheck} ${usersCondition}
    GROUP BY plays.game_id`, values)
    .then(res => res.rows)
    .catch(error => console.log(error))
};

const isUserInPlay = function (db, playId, userId) {
  return db.query(`SELECT plays_users.id
   FROM plays_users 
   JOIN plays ON plays.id = plays_users.play_id
   WHERE plays_users.user_id = $1 AND plays.id = $2`, [userId, playId])
    .then(res => res.rows.length > 0)
    .catch(err =>console.log(err));
};

// const getPlaysUserByUserId = function (db, userId) {
//   return db.query(`SELECT plays_users.*
//    FROM plays_users JOIN plays ON plays_users.play_id = plays.id
//    WHERE plays_users.user_id = $1`, [userId])
//     .then(res => res.rows);
// };

//https://stackoverflow.com/questions/10720420/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query
const getPlaysUserByPlayIds = function (db, playIds) {
  return db.query(`SELECT plays_users.*
   FROM plays_users JOIN plays ON plays_users.play_id = plays.id
   WHERE plays.id = ANY($1::int[])`, [playIds])
    .then(res => res.rows);
};

const getPlaysByGameId = function (db, gameId) {
  return db.query(`SELECT * FROM plays WHERE plays.game_id = $1`, [gameId])
    .then(res => res.rows);
};

//get top score by user and by game?

const addPlay = function (db, play) {
  const validColumns = playsColumnsNames.filter(column => column in play);
  const indexArray = validColumns.map((column, index) => `$${index + 1}`);
  const values = validColumns.map(column => play[column]);

  return db.query(`INSERT INTO plays (${validColumns.join(', ')})
    VALUES (${indexArray.join(', ')}) RETURNING *;`, values)
    .then(function (res) {
      return res.rows[0];
    });
};

const addUserPlay = function (db, userPlay) {
  const validColumns = playsUsersColumnsNames.filter(column => column in userPlay);
  const indexArray = validColumns.map((column, index) => `$${index + 1}`);
  const values = validColumns.map(column => userPlay[column]);

  return db.query(`INSERT INTO plays_users (${validColumns.join(', ')})
    VALUES (${indexArray.join(', ')}) RETURNING *;`, values)
    .then(function (res) {
      return res.rows[0];
    });
};

const deleteUserPlay = function (db, id, userId) {
  return db.query(`DELETE FROM plays_users WHERE plays_users.play_id = $1 AND plays_users.user_id = $2`, [id, userId]);
};

const updateUserPlay = function (db, userPlay) {
  const validColumns = playsUsersColumnsNames.filter(column => column in userPlay);
  const values = validColumns.map(column => userPlay[column]);

  const sets = values.map((value, index) => `${validColumns[index]} = $${index + 1}`)

  values.push(userPlay.user_id);
  values.push(userPlay.play_id);

  const query = `UPDATE plays_users
    SET ${sets.join(', ')}
    WHERE plays_users.user_id = $${values.length - 1} AND plays_users.play_id = $${values.length}
    RETURNING *;`

  return db.query(query, values)
    .then(res => {
      return res.rows[0]
    }).catch (err => console.log(err));
};

const updatePlay = function (db, play) {
  const validColumns = playsColumnsNames.filter(column => column in play);
  const values = validColumns.map(column => play[column]);

  const sets = values.map((value, index) => `${validColumns[index]} = $${index + 1}`)

  values.push(play.id);

  let query = `UPDATE plays
    SET ${sets.join(', ')}
    WHERE plays.id = $${values.length}
    RETURNING *;`

  return db.query(query, values)
    .then(res => res.rows[0]);
};

const deletePlay = function (db, id) {
  return db.query(`DELETE FROM plays WHERE plays.id = $1`, [id]);
};


module.exports = {
  isUserInPlay,
  getPlaysByUserId,
  getPlaysUserByPlayIds,
  addPlay,
  addUserPlay,
  deleteUserPlay,
  updateUserPlay,
  updatePlay,
  deletePlay,
  getPlaysStatistics
};


