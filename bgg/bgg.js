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
        ${parseNum(data.id)},
        ${parseDoubleQuote(data.name)},
        ${parseDescription(data.description)},
        ${parseNum(data.yearpublished)},
        ${parseNum(data.age.min)},
        ${parseNum(data.playtime.min)},
        ${parseNum(data.playtime.max)},
        ${parseNum(data.id)},
        ${parseFlo(data.rating)}, 
        ${parseDoubleQuote(data.thumbnail)},
        ${parseDoubleQuote(data.image)},
        ${parseArray(data.categories)},
        ${parseArray(data.mechanics)})`
      index === gameData.length - 1 ? sqlQuery += ';\n' : sqlQuery += ',\n'
    })
    return sqlQuery;
  }

  )
  .then((sqlSeedQuery) => {
    fs.writeFileSync('../src/db/seeds/02_games.sql', sqlSeedQuery);
  })

