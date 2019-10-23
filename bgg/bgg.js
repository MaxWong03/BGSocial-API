const bgg = require('boardgamegeek');
const fs = require('fs');


// There are 43730 id

const generateBGGPromise = (promiseArr, gameNum) => {
  for (let i = 1; i <= gameNum; i++) {
    promiseArr.push(bgg.getBoardGameById(i));
  }
};

const parseDescription = (desc) => {
  return JSON.stringify(
    (
      desc
    ) 
      .replace(/\\/g, '')
      .replace(/"/g, "'")
      .replace(/'/g, '')
      .replace(/\n/g, '')
    )
      .replace(/"/g, "'");
};

const parseNum = (int) => {
 return JSON.stringify(parseInt(int));
};

const parseFlo = (float) => {
  return JSON.stringify(parseFloat(float));
}

const parseArray = (arr) => {
  return JSON.stringify(arr.join(", ")).replace(/"/g, "'");
}

const parseDoubleQuote = (quote) => {
  return JSON.stringify(quote).replace(/"/g, "'")
}

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

    return sqlQuery
  }

  )
  .then((sqlSeedQuery) => {
    fs.writeFileSync('../src/db/seeds/02_games.sql', sqlSeedQuery)
  })

