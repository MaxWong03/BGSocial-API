const bgg = require('boardgamegeek');
const fs = require('fs');
const {
  parseDescription,
  parseNum,
  parseFlo,
  parseArray,
  parseDoubleQuote
} = require('./helpers/parsers');

// There are 43730 id

const generateBGGPromise = (promiseArr, gameNum) => {
  for (let i = 1; i <= gameNum; i++) {
    promiseArr.push(bgg.getBoardGameById(i));
  }
};

const bggPromise = [];
let sqlQuery = 'INSERT INTO games (id, name, description, year_published, age, play_time_min, play_time_max, bgg_id, average_bgg_rating, thumbnail, image, category, mechanic) VALUES\n'


generateBGGPromise(bggPromise, 32);


Promise.all(bggPromise)
  .then((gameData) => {
    gameData.forEach((data, index) => {

      sqlQuery += `(
        ${parseNum(data.id)}, --id
        ${parseDoubleQuote(data.name)}, --name
        ${parseDescription(data.description)}, --description
        ${parseNum(data.yearpublished)}, --year_published
        ${parseNum(data.age.min)}, --age
        ${parseNum(data.playtime.min)}, --play_time_min
        ${parseNum(data.playtime.max)}, --play_time_max
        ${parseNum(data.id)}, --bgg_id
        ${parseFlo(data.rating)}, --rating
        ${parseDoubleQuote(data.thumbnail)}, --thumbnail
        ${parseDoubleQuote(data.image)}, --image
        ${parseArray(data.categories)}, --category
        ${parseArray(data.mechanics)}) --mechanic`
      index === gameData.length - 1 ? sqlQuery += '\n;\n' : sqlQuery += '\n,\n'
    })
    return sqlQuery;
  })
  .then((sqlSeedQuery) => fs.writeFileSync('../src/db/seeds/02_games.sql', sqlSeedQuery));

