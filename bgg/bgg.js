const bgg = require('boardgamegeek');
const fs = require('fs');


// There are 43730 id

const bggPromise = [];
let sqlQuery = 'INSERT INTO games (id, name, description, year_published, age, play_time_min, play_time_max, bgg_id, average_bgg_rating, thumbnail, image, category, mechanic) VALUES\n'

const generateBGGPromise = (promiseArr, gameNum) => {
  for (let i = 1; i <= gameNum; i++) {
    promiseArr.push(bgg.getBoardGameById(i));
  }

}

generateBGGPromise(bggPromise, 32);

Promise.all(bggPromise)
  .then((gameData) => {
    gameData.forEach((data, index) => {
      const parsedDescription = JSON.stringify(
      (
      data.description) 
        .replace(/\\/g, '')
        .replace(/"/g, "'")
        .replace(/'/g, '')
        .replace(/\n/g, '')
      ).replace(/"/g, "'")
      sqlQuery += `(
        ${JSON.stringify(parseInt(data.id))},
        ${JSON.stringify(data.name).replace(/"/g, "'")},
        ${parsedDescription},
        ${JSON.stringify(parseInt(data.yearpublished))},
        ${JSON.stringify(parseInt(data.age.min))},
        ${JSON.stringify(parseInt(data.playtime.min))},
        ${JSON.stringify(parseInt(data.playtime.max))},
        ${JSON.stringify(parseInt(data.id))},
        ${JSON.stringify(parseFloat(data.rating))}, 
        ${JSON.stringify(data.thumbnail).replace(/"/g, "'")},
        ${JSON.stringify(data.image).replace(/"/g, "'")},
        ${JSON.stringify(data.categories.join(", ")).replace(/"/g, "'")},
        ${JSON.stringify(data.mechanics.join(", ")).replace(/"/g, "'")})`
      index === gameData.length - 1 ? sqlQuery += ';\n' : sqlQuery += ',\n'
    })

    return sqlQuery
  }

  )
  .then((sqlSeedQuery) => {
    fs.writeFileSync('../src/db/seeds/02_games.sql', sqlSeedQuery)
  })

