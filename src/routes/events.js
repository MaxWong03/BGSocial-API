const router = require("express").Router();

const { getLoggedUserId } = require('../utils');
const {
  createEvent,
  addEventDate,
  addEventGame,
  addEventAttendant,
  getEventById,
  getDatesByEventId,
  getAttendantsByEventId,
  getGamesByEventId,
  getAllEventsByAttendantId,
  getGamesByEvent,
  getVotesByDateId,
  deleteEventByEventId,
  getVotesByEventId,
  confirmDateByEventId,
  doesUserOwnsEvent,
  confirmAssitanceByEventId,
  addVoteForEventId,
  deleteVoteByDateId,
  getAttendantIdByUserId

} = require('../db/selectors/events.js');

const { getGamesByIds } = require('../db/selectors/games.js');


module.exports = db => {

  router.get("/", async (req, res) => {
    const userId = getLoggedUserId(req);
    try {
      const events = await getAllEventsByAttendantId(db, userId);
      const eventsIds = events.map(event => event.id);
      const gamesByEvent = await Promise.all(eventsIds.map(eventId => getGamesByEvent(db, eventId)));
      const attendantsByEvent = await Promise.all(eventsIds.map(eventId => getAttendantsByEventId(db, eventId)));
      const eventsDates = await Promise.all(eventsIds.map(eventId => getDatesByEventId(db, eventId)));
      events.forEach((event, index) => {
        event.event_games = gamesByEvent[index]
        event.event_attendants = attendantsByEvent[index]
        event.event_dates = eventsDates[index]
      });
      res.json(events);
    } catch (error) {
      res
        .status(500)
        .json({ error: error });
      console.log(error);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const [event, eventDates, eventAttendants, eventGames, eventVotes] = await Promise.all([
        getEventById(db, req.params.id),
        getDatesByEventId(db, req.params.id),
        getAttendantsByEventId(db, req.params.id),
        getGamesByEventId(db, req.params.id),
        getVotesByEventId(db, req.params.id)
      ]);
      const gameIds = eventGames.map(eventGame => eventGame.game_id);
      const games = await getGamesByIds(db, gameIds);

      eventGames.forEach(eventGame => {
        eventGame.game = games.find(game => game.id === eventGame.game_id);
      });

      const response = {
        ...event,
        event_dates: eventDates,
        event_attendants: eventAttendants,
        event_games: eventGames,
        event_votes: eventVotes
      };
      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ error: error });
      console.log(error);
    }
  });

  router.post("/", async (req, res) => {
    try {
      const userId = getLoggedUserId(req);
      const event = await createEvent(db, userId);

      const [eventDates, eventAttendants, eventGames] = await Promise.all([
        Promise.all(req.body.eventDates.map(eventDate => addEventDate(db, { ...eventDate, event_id: event.id }))),
        Promise.all(req.body.eventAttendants.map(eventAttendant => addEventAttendant(db, { ...eventAttendant, event_id: event.id }))),
        Promise.all(req.body.eventGames.map(eventGame => addEventGame(db, { ...eventGame, event_id: event.id }))),
      ]);
      res.json({ ...event, event_dates: eventDates, event_attendants: eventAttendants, event_games: eventGames });
    }
    catch (error) {
      res
        .status(500)
        .json({ error: error });
      console.log(error);
    }
  });

  router.post("/:id/attendants", (req, res) => {
    const eventId = req.params.id;
    const userId = getLoggedUserId(req);
    if (doesUserOwnsEvent(db, eventId, userId)) {
      // expecting array with usersID
      const eventAtendantsPromises = req.body.eventAttendants
        .map(eventAttendant => addEventAttendant(db, { ...eventAttendant, event_id: eventId }))
      Promise.all(eventAtendantsPromises)
        .then(eventAtendantsPromises => {
          res.json(eventAtendantsPromises);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    }
  });

  router.post("/:id/games", (req, res) => {
    const userId = getLoggedUserId(req);
    if (doesUserOwnsEvent(db, req.params.id, userId)) {
      // expecting array with gamesID
      const eventGamesPromises = req.body.eventGames.map(eventGame => addEventGame(db, eventGame, req.params.id))
      Promise.all(eventGamesPromises)
        .then(eventGamesPromises => {
          res.json(eventGamesPromises);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    }
  });

  router.post("/:id/delete", (req, res) => {
    const userId = getLoggedUserId(req);
    deleteEventByEventId(db, req.params.id, userId)
      .then(() => {
        console.log("success");
        res.send("Success");
      })
      .catch(err => {
        console.log("About to error out", err);
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // owner choose date for event
  router.post("/:id/dates/:dateid", (req, res) => {
    const userId = getLoggedUserId(req);
    const eventId = req.params.id
    if (doesUserOwnsEvent(db, eventId, userId)) {
      confirmAssitanceByEventId(db, eventId, userId)
      confirmDateByEventId(db, eventId, req.params.dateid)
        .then(() => {
          console.log("success");
          res.send("Success");
        })
        .catch(err => {
          console.log("About to error out", err);
          res
            .status(500)
            .json({ error: err.message });
        });
    }
  });

  //user votes for event date
  router.post("/:id/dates/:eventDateId/vote", async (req, res) => {
    const userId = getLoggedUserId(req);
    const eventId = req.params.id;
    const eventDateId = req.params.eventDateId;
    const attendantId = await getAttendantIdByUserId(db, userId, eventId);
    await deleteVoteByDateId(db, eventDateId, attendantId)
    await addVoteForEventId(db, eventDateId, attendantId)
        .then(() => {
          res.send("Successful vote");
        })
        .catch(err => {
          console.log("About to error out", err);
          res
            .status(500)
            .json({ error: err.message });
        });
  });

  //user delete its vote for that event date
  router.post("/:id/dates/:eventDateId/vote-delete", async(req, res) => {
    const eventId = Number(req.params.id)
    const userId = getLoggedUserId(req);
    const eventDateId = Number(req.params.eventDateId)
    const attendantId = await getAttendantIdByUserId(db, userId, eventId)
    await deleteVoteByDateId(db, eventDateId, attendantId)
        .then(() => {
          res.send("Successful deleted vote");
        })
        .catch(err => {
          console.log("About to error out", err);
          res
            .status(500)
            .json({ error: err.message });
        });
  });

  return router;
};
