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

const isUserInPlay = function (db, playId, userId) {
  return db.query(`SELECT plays_users.id
   FROM plays_users
   WHERE plays.user_id = $1 AND plays.play_id = $2`, [userId, playId])
    .then(res => res.rows.length > 0);
};

// const getPlaysUserByUserId = function (db, userId) {
//   return db.query(`SELECT plays_users.*
//    FROM plays_users JOIN plays ON plays_users.play_id = plays.id
//    WHERE plays_users.user_id = $1`, [userId])
//     .then(res => res.rows);
// };

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
    .then(res => res.rows[0]);
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
  deletePlay
};


