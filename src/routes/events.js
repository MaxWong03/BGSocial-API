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
  getVotesByDateId

} = require('../db/events.js');

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
      // const eventsDatesIds = eventsDates.map(eventDate => )
      // console.log(eventsDatesIds)
      // const votesByEvent = await Promise.all(eventsDatesIds.map(eventDateId => getVotesByDateId(db, eventDateId)));
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
      const [event, eventDates, eventAttendants, eventGames] = await Promise.all([
        getEventById(db, req.params.id),
        getDatesByEventId(db, req.params.id),
        getAttendantsByEventId(db, req.params.id),
        getGamesByEventId(db, req.params.id)
      ]);
      const gameIds = eventGames.map(eventGame => eventGame.game_id);
      const games = await getGamesByIds(db, gameIds);

      eventGames.forEach(eventGame => {
        eventGame.game = games.find(game => game.id === eventGame.game_id);
      });

      const response = { ...event, eventDates, eventAttendants, eventGames };
      res.json(response);
    } catch (error) {
      res
        .status(500)
        .json({ error: error });
      console.log(error);
    }

    //   Promise.all([
    //     getPlaysUserByPlayIds(db, playsIds),
    //     getGamesByIds(db, gameIds)
    //   ]).then(([playsUsers, games]) => {
    //     const gamesById = games.reduce((accum, item) => {
    //       accum[item.id] = item;
    //       return accum;
    //     }, {});

    //     plays.forEach(play => {
    //       play.playsUsers = playsUsers.filter(playUser => playUser.play_id == play.id);
    //     });

    //     res.json({ plays: plays, games: gamesById });
    //   }).catch(e => console.log(e));

    // });
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
      res.json({ ...event, eventDates, eventAttendants, eventGames });
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

  return router;
};
