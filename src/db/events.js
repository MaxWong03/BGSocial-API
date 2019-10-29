const eventDatesColumnsNames = [
  'is_chosen',
  'is_open',
  'date',
  'location',
  'event_id'
];

const getAllEventsByAttendantId = function (db, userID) {
  return db.query(`SELECT events.*, 
  chosen_event_dates.date as "event_dates.date", chosen_event_dates.location as "event_dates.location" 
  FROM attendances
  JOIN events ON attendances.event_id = events.id
  LEFT JOIN (SELECT * FROM event_dates WHERE event_dates.is_chosen = TRUE) as chosen_event_dates on events.id = chosen_event_dates.event_id
  WHERE 
  attendances.attendant_id = $1`, [userID])
    .then(res => {
      return res.rows.map(row => {
        const newRow = { ...row };
        newRow.chosen_event_date = {
          'date': row['event_dates.date'],
          'location': row['event_dates.location'],
        };
        delete newRow['event_dates.date'];
        delete newRow['event_dates.location'];
        return newRow;
      });
    });
};

const getGamesByEvent = function (db, eventID) {
  return db.query(`SELECT  games.* FROM event_games JOIN games ON games.id = event_games.game_id 
  WHERE event_games.event_id = $1`, [eventID])
    .then(function (res) {
      return res.rows;
    }).catch(err => console.log(err));
};


const createEvent = function (db, userID) {
  return db.query(`INSERT INTO events (owner_id)
    VALUES ($1) RETURNING *;`, [userID])
    .then(function (res) {
      return res.rows[0];
    });
};

const addEventDate = function (db, eventDate) {
  const validColumns = eventDatesColumnsNames.filter(column => column in eventDate);
  const indexArray = validColumns.map((column, index) => `$${index + 1}`);
  const values = validColumns.map(column => eventDate[column]);

  return db.query(`INSERT INTO event_dates (${validColumns.join(', ')})
    VALUES (${indexArray.join(', ')}) RETURNING *;`, values)
    .then(function (res) {
      return res.rows[0];
    }).catch(err => console.log(err));
};

const doesUserOwnsEvent = function (db, eventId, userId) {
  return db.query(`SELECT plays_users.id
   FROM events
   WHERE events.id = $1 AND events.owner_id = $2`, [eventId, userId])
    .then(res => res.rows.length > 0);
};

const addEventGame = function (db, eventGame) {
  return db.query(`INSERT INTO event_games (game_id, event_id)
  VALUES ($1, $2) RETURNING *;`, [eventGame.game_id, eventGame.event_id])
    .then(function (res) {
      return res.rows[0];
    });
};

const addEventAttendant = function (db, attendant) {
  return db.query(`INSERT INTO attendances (attendant_id, event_id)
  VALUES ($1, $2) RETURNING *;`, [attendant.attendant_id, attendant.event_id])
    .then(function (res) {
      return res.rows[0];
    });
};

const getEventById = function (db, eventId) {
  return db.query(`SELECT * FROM events WHERE id = $1`, [eventId])
    .then(res => res.rows[0]);
};

const getDatesByEventId = function (db, eventId) {
  return db.query(`SELECT * FROM event_dates WHERE event_id = $1`, [eventId])
    .then(res => res.rows);
};

const getAttendantsByEventId = function (db, eventId) {
  return db.query(`SELECT * FROM attendances JOIN users 
  ON attendances.attendant_id = users.id
  WHERE event_id = $1`, [eventId])
    .then(res => res.rows)
    .catch(err => console.log(err));
};

const getVotesByDateId = function (db, eventDateId) {
  return db.query(`SELECT * FROM event_dates_votes WHERE event_date_id = $1`, [eventDateId])
    .then(res => res.rows)
    .catch(err => console.log(err));
};

const getGamesByEventId = function (db, eventId) {
  return db.query(`SELECT * FROM event_games WHERE event_id = $1`, [eventId])
    .then(res => res.rows);
};



// const addPlay = function (db, play) {
//   const validColumns = playsColumnsNames.filter(column => column in play);
//   const indexArray = validColumns.map((column, index) => `$${index + 1}`);
//   const values = validColumns.map(column => play[column]);

//   return db.query(`INSERT INTO plays (${validColumns.join(', ')})
//     VALUES (${indexArray.join(', ')}) RETURNING *;`, values)
//     .then(function (res) {
//       return res.rows[0];
//     });
// };

// const getGamesByIds = function (db, gameIds) {
//   return db.query(`SELECT * FROM games WHERE id = ANY($1::int[])`, [gameIds])
//     .then(res => res.rows);
// };

// const getPlaysByUserId = function (db, userId) {
//   return db.query(`SELECT plays.*
//    FROM plays_users JOIN plays ON plays_users.play_id = plays.id
//    WHERE plays_users.user_id = $1`, [userId])
//     .then(res => res.rows);
// };

// const isUserInPlay = function (db, playId, userId) {
//   return db.query(`SELECT plays_users.id
//    FROM plays_users
//    WHERE plays.user_id = $1 AND plays.play_id = $2`, [userId, playId])
//     .then(res => res.rows.length > 0);
// };

// // const getPlaysUserByUserId = function (db, userId) {
// //   return db.query(`SELECT plays_users.*
// //    FROM plays_users JOIN plays ON plays_users.play_id = plays.id
// //    WHERE plays_users.user_id = $1`, [userId])
// //     .then(res => res.rows);
// // };

// const getPlaysUserByPlayIds = function (db, playIds) {
//   return db.query(`SELECT plays_users.*
//    FROM plays_users JOIN plays ON plays_users.play_id = plays.id
//    WHERE plays.id = ANY($1::int[])`, [playIds])
//     .then(res => res.rows);
// };

// const getPlaysByGameId = function (db, gameId) {
//   return db.query(`SELECT * FROM plays WHERE plays.game_id = $1`, [gameId])
//     .then(res => res.rows);
// };

// //get top score by user and by game?

// const deleteUserPlay = function (db, id, userId) {
//   return db.query(`DELETE FROM plays_users WHERE plays_users.play_id = $1 AND plays_users.user_id = $2`, [id, userId]);
// };

// const updateUserPlay = function (db, userPlay) {
//   const validColumns = playsUsersColumnsNames.filter(column => column in userPlay);
//   const values = validColumns.map(column => userPlay[column]);

//   const sets = values.map((value, index) => `${validColumns[index]} = $${index + 1}`)

//   values.push(userPlay.user_id);
//   values.push(userPlay.play_id);

//   const query = `UPDATE plays_users
//     SET ${sets.join(', ')}
//     WHERE plays_users.user_id = $${values.length - 1} AND plays_users.play_id = $${values.length}
//     RETURNING *;`

//   return db.query(query, values)
//     .then(res => res.rows[0]);
// };

// const updatePlay = function (db, play) {
//   const validColumns = playsColumnsNames.filter(column => column in play);
//   const values = validColumns.map(column => play[column]);

//   const sets = values.map((value, index) => `${validColumns[index]} = $${index + 1}`)

//   values.push(play.id);

//   let query = `UPDATE plays
//     SET ${sets.join(', ')}
//     WHERE plays.id = $${values.length}
//     RETURNING *;`

//   return db.query(query, values)
//     .then(res => res.rows[0]);
// };

// const deletePlay = function (db, id) {
//   return db.query(`DELETE FROM plays WHERE plays.id = $1`, [id]);
// };


module.exports = {
  createEvent,
  addEventDate,
  doesUserOwnsEvent,
  addEventGame,
  addEventAttendant,
  getEventById,
  getDatesByEventId,
  getAttendantsByEventId,
  getGamesByEventId,
  getAllEventsByAttendantId,
  getGamesByEvent,
  getAttendantsByEventId,
  getVotesByDateId
};

