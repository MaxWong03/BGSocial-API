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
  return db.query(`SELECT id
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

const getVotesByEventId = function (db, eventId) {
  return db.query(`SELECT event_dates.event_id, event_dates_votes.id AS event_date_id, event_dates_votes.event_date_id,
  event_dates.location, event_dates.date, event_dates.id AS event_date_id, attendances.attendant_id AS user_id
  FROM event_dates_votes 
  JOIN event_dates ON event_dates.id = event_dates_votes.event_date_id
  JOIN attendances ON event_dates_votes.attendance_id = attendances.id
  WHERE event_dates.event_id = $1`, [eventId])
    .then(res => res.rows)
    .catch(err => console.log(err));
};

const getGamesByEventId = function (db, eventId) {
  return db.query(`SELECT * FROM event_games WHERE event_id = $1`, [eventId])
    .then(res => res.rows);
};

const deleteEventByEventId = function (db, eventId, userId) {
  return db.query(`DELETE FROM events 
  WHERE events.id = $1 AND events.owner_id = $2`, [eventId, userId]);
};

const confirmDateByEventId = function (db, eventId, dateId) {
  return db.query(`UPDATE event_dates 
  SET is_chosen = TRUE
  WHERE event_id = $1 AND id = $2`, [eventId, dateId]);
};


const confirmAssitanceByEventId = function (db, eventId, userId) {
  return db.query(`UPDATE attendances 
  SET is_confirmed = TRUE
  WHERE event_id = $1 AND attendant_id = $2`, [eventId, userId]);
};

const deleteVoteByDateId = function (db, eventDateId, attendantId) {
  return db.query(`DELETE FROM event_dates_votes
  WHERE event_dates_votes.event_date_id = $1 AND event_dates_votes.attendance_id = $2`, [eventDateId, attendantId]);
};


const addVoteForEventId = function (db, eventDateId, attendantId) {
  return db.query(`INSERT INTO event_dates_votes (event_date_id, attendance_id)
  VALUES ($1, $2) RETURNING *;`, [ eventDateId,  attendantId])
    .then(function (res) {
      return res.rows[0];
    });
};

const getAttendantIdByUserId = function (db, userId, eventId) {
  return db.query(`SELECT id FROM attendances 
  WHERE attendant_id = $1 and event_id= $2`, [userId, eventId])
    .then(res => {
      return res.rows[0].id;
    }
     );
};

const setNotGoingToEventByEventId = function (db, eventId, userId) {
  return db.query(`UPDATE attendances 
  SET is_not_assisting = TRUE
  WHERE event_id = $1 AND attendant_id = $2`, [eventId, userId]);
};

const getIsConfirmValueOfAttendant = function (db, eventId, userId) {
  return db.query(`SELECT is_confirmed FROM attendances 
  WHERE attendant_id = $1 and event_id= $2`, [userId, eventId])
    .then(res => {
      return res.rows[0].is_confirmed;
    }
     );
};

const setGoingToEventByEventId = function (db, eventId, userId, goingValueOfUser) {
  return db.query(`UPDATE attendances 
  SET is_confirmed = $3
  WHERE event_id = $1 AND attendant_id = $2`, [eventId, userId, goingValueOfUser]);
};


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
  getVotesByDateId,
  deleteEventByEventId,
  getVotesByEventId,
  confirmDateByEventId,
  doesUserOwnsEvent,
  confirmAssitanceByEventId,
  deleteVoteByDateId,
  addVoteForEventId,
  getAttendantIdByUserId,
  setNotGoingToEventByEventId,
  getIsConfirmValueOfAttendant,
  setGoingToEventByEventId

};

