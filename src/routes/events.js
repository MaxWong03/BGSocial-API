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
  getAttendanceByUserId,
  setNotGoingToEventByEventId,
  setGoingToEventByEventId,
  deleteAttendanceById,
  getAllOpenEventsByAttendantId,
  deleteEventDatesByEventId,
  deleteAttendancesByEventId,
  deleteEventGamesByEventId,
  updateEvent

} = require('../db/selectors/events.js');

const { getFriendsIdByUserId } = require('../db/selectors/users.js');

const { getGamesByIds } = require('../db/selectors/games.js');


module.exports = db => {

  router.get("/", async (req, res) => {
    try {
      const userId = getLoggedUserId(req);
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

  // get open events for user 

  router.get("/open-events", async (req, res) => {
    try {
      const userId = getLoggedUserId(req);
      const userFriends = await getFriendsIdByUserId(db, userId);
      const userFriendsId = userFriends.map(friends => friends.id);
      const events = await getAllOpenEventsByAttendantId(db, userId, userFriendsId);
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

  //create an event
  router.post("/", async (req, res) => {
    try {
      const userId = getLoggedUserId(req);
      console.log(req.body.event)
      const event = await createEvent(db, req.body);

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

  // edit event
  router.post("/:id", async (req, res) => {
    const userId = getLoggedUserId(req);
    const eventId = req.body.eventId;
    try {
      const event = await getEventById(db, req.params.id);
      if (event && userId === event.owner_id) {
        const deletePromises = [];
        if ('eventDates' in req.body) {
          deletePromises.push(deleteEventDatesByEventId(db, eventId));
        }
        if ('eventAttendants' in req.body) {
          deletePromises.push(deleteAttendancesByEventId(db, eventId));
        }
        if ('eventGames' in req.body) {
          deletePromises.push(deleteEventGamesByEventId(db, eventId));
        }
        await Promise.all(deletePromises);

        const updatedEvent = await updateEvent(db, { ...req.body, id: event.id });

        const [eventDates, eventAttendants, eventGames] = await Promise.all([
          Promise.all((req.body.eventDates || []).map(eventDate => addEventDate(db, { ...eventDate, event_id: event.id }))),
          Promise.all((req.body.eventAttendants || []).map(eventAttendant => addEventAttendant(db, { ...eventAttendant, event_id: event.id }))),
          Promise.all((req.body.eventGames || []).map(eventGame => addEventGame(db, { ...eventGame, event_id: event.id }))),
        ]);
        res.json({...updatedEvent, event_dates: eventDates, event_attendants: eventAttendants, event_games: eventGames });
      }
      else {
        res.status(301).json({'message': 'forbidden'});
      }
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
    const eventId = req.params.id;
    if (doesUserOwnsEvent(db, eventId, userId)) {
      confirmAssitanceByEventId(db, eventId, userId);
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
    try {
      const userId = getLoggedUserId(req);
      const eventId = req.params.id;
      const eventDateId = req.params.eventDateId;
      const attendance =  await getAttendanceByUserId(db, eventId, userId);
      const attendantId = attendance.id;
      await deleteVoteByDateId(db, eventDateId, attendantId);
      addVoteForEventId(db, eventDateId, attendantId)
        .then(() => {
          res.send("Successful vote");
        })
        .catch(err => {
          console.log("About to error out", err);
          res
            .status(500)
            .json({ error: err.message });
        });
    } catch (error) {
      res
        .status(500)
        .json({ error: error });
      console.log(error);
    }
  });

  //user delete its vote for that event date
  router.post("/:id/dates/:eventDateId/vote-delete", async (req, res) => {
    try {
      const eventId = Number(req.params.id);
      const userId = getLoggedUserId(req);
      const eventDateId = Number(req.params.eventDateId);
      const attendance =  await getAttendanceByUserId(db, eventId, userId);
      const attendantId = attendance.id;
      deleteVoteByDateId(db, eventDateId, attendantId)
        .then(() => {
          res.send("Successful deleted vote");
        })
        .catch(err => {
          console.log("About to error out", err);
          res
            .status(500)
            .json({ error: err.message });
        });
    } catch (error) {
      res
        .status(500)
        .json({ error: error });
      console.log(error);
    }
  });

  // user is not going to event (column is is_not_assisting in attendances)
  router.post("/:id/not-going", async (req, res) => {
    const eventId = Number(req.params.id)
    const userId = getLoggedUserId(req);
    console.log('enter to not going')
    setNotGoingToEventByEventId(db, eventId, userId)
      .then(() => {
        res.send("Successful update to not going");
      })
      .catch(err => {
        console.log("About to error out", err);
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //user is going to event (column is_confirmed in attendances)
  router.post("/:id/going", async (req, res) => {
    const eventId = Number(req.params.id);
    const userId = getLoggedUserId(req);
    try {
      const attendance = await getAttendanceByUserId(db, eventId, userId);
      if (!attendance) {
        const createdAttendance = await addEventAttendant(db, {
          attendant_id: userId,
          event_id: eventId,
          is_invited: false,
          is_confirmed: true
        });
        res.send("Successfuly added not invited user (explore)");
      }
      else {
        if (attendance.is_invited) {
          await setGoingToEventByEventId(db, eventId, userId, !attendance.is_confirmed);
          res.send("Successful update of going value (is_confirm of attendant)");
        }
        else {
          await deleteAttendanceById(db, attendance.id);
          res.send("Successfuly deleted attendance (not invited)");
        }
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: error });
      console.log(error);
    }
  });

  return router;
};
