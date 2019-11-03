const eventDatesColumnsNames = [
  'is_chosen',
  'date',
  'location',
  'event_id'
];

const eventColumnsNames = [
  'title',
  'image',
  'spots',
  'owner_id',
  'is_open',
  'id'
];

const eventAttendantColumnsNames = [
  'is_invited',
  'event_id',
  'attendant_id',
  'is_confirmed',
  'is_not_assisting'
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

const getAllEventsIdsByAttendantId = function (db, userID) {
  return db.query(`SELECT events.id 
  FROM attendances
  JOIN events ON attendances.event_id = events.id
  WHERE attendances.attendant_id = $1`, [userID])
    .then(res => {
      return res.rows.map(event => event.id);
    });
};

const getAllOpenEventsByAttendantId = async function (db, userID, userFriendsId) {
  const userEventIds = await getAllEventsIdsByAttendantId(db, userID);

  return db.query(`SELECT events.*, event_dates.location as "event_dates.location", 
  event_dates.date as "event_dates.date" FROM events 
  JOIN event_dates ON events.id = event_dates.event_id 
  JOIN (SELECT event_id, count(*) as used_spots FROM attendances where attendances.is_confirmed = TRUE GROUP BY event_id) as confirmed_counts ON confirmed_counts.event_id = events.id
  WHERE events.is_open = TRUE AND events.spots > confirmed_counts.used_spots
  AND event_dates.is_chosen = TRUE 
  AND events.id != ALL ($3::int[])
  AND events.owner_id = ANY($2::int[])
  AND events.owner_id != $1`, [userID, userFriendsId, userEventIds])
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


const createEvent = function (db, event) {
  const validColumns = eventColumnsNames.filter(column => column in event);
  const indexArray = validColumns.map((column, index) => `$${index + 1}`);
  const values = validColumns.map(column => event[column]);

  return db.query(`INSERT INTO events (${validColumns.join(', ')})
    VALUES (${indexArray.join(', ')}) RETURNING *;`, values)
    .then((res) => {
      return res.rows[0];
    }).catch(err => console.log(err));
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
  const validColumns = eventAttendantColumnsNames.filter(column => column in attendant);
  const indexArray = validColumns.map((column, index) => `$${index + 1}`);
  const values = validColumns.map(column => attendant[column]);

  return db.query(`INSERT INTO attendances (${validColumns.join(', ')})
    VALUES (${indexArray.join(', ')}) RETURNING *;`, values)
    .then((res) => {
      return res.rows[0];
    }).catch(err => console.log(err));
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

const deleteAttendanceById = function (db, attendanceId) {
  return db.query(`DELETE FROM attendances
  WHERE id = $1`, [attendanceId]);
};

const addVoteForEventId = function (db, eventDateId, attendantId) {
  return db.query(`INSERT INTO event_dates_votes (event_date_id, attendance_id)
  VALUES ($1, $2) RETURNING *;`, [eventDateId, attendantId])
    .then(function (res) {
      return res.rows[0];
    });
};

const getAttendanceByUserId = function (db, eventId, userId) {
  return db.query(`
    SELECT attendances.*
    FROM attendances 
    WHERE attendant_id = $1 AND event_id = $2`, [userId, eventId])
    .then(res => {
      return res.rows[0];
    });
};

const setNotGoingToEventByEventId = function (db, eventId, userId) {
  return db.query(`UPDATE attendances 
  SET is_not_assisting = TRUE
  WHERE event_id = $1 AND attendant_id = $2`, [eventId, userId]);
};


const setGoingToEventByEventId = function (db, eventId, userId, goingValueOfUser) {
  return db.query(`UPDATE attendances 
  SET is_confirmed = $3
  WHERE event_id = $1 AND attendant_id = $2`, [eventId, userId, goingValueOfUser]);
};

const updateEvent = function (db, event) {
  const validColumns = eventColumnsNames.filter(column => column in event);
  const values = validColumns.map(column => event[column]);

  const sets = values.map((value, index) => `${validColumns[index]} = $${index + 1}`)

  values.push(event.id);

  let query = `UPDATE events
    SET ${sets.join(', ')}
    WHERE events.id = $${values.length}
    RETURNING *;`

  return db.query(query, values)
    .then(res => res.rows[0]);
};

const deleteEventDatesByEventId = function (db, eventID) {
  return db.query(`DELETE FROM event_dates
  WHERE event_dates.event_id = $1`, [eventID]);
};

const deleteAttendancesByEventId = function (db, eventID) {
  return db.query(`DELETE FROM attendances
  WHERE attendances.event_id = $1`, [eventID]);
};

const deleteEventGamesByEventId = function (db, eventID) {
  return db.query(`DELETE FROM event_games
  WHERE event_games.event_id = $1`, [eventID]);
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
  getAttendanceByUserId,
  setNotGoingToEventByEventId,
  setGoingToEventByEventId,
  getAllOpenEventsByAttendantId,
  deleteAttendanceById,
  deleteEventDatesByEventId,
  deleteAttendancesByEventId,
  deleteEventGamesByEventId,
  updateEvent
};

