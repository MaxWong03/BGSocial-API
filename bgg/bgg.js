const bgg = require('boardgamegeek');
const fs = require('fs');

// bgg.getBoardGameById('43730')
//   .then(data => console.log(data));

const bggPromise = [];
let sqlQuery = 'INSERT INTO games (id, name, description, yearpublished, age, playtimemin, playtimemax, bggid, averagebggrating, thumbnail, image, category, mechanic) VALUES\n'




for (let i = 1; i <= 10; i++) {
  bggPromise.push(bgg.getBoardGameById(i))
}

Promise.all(bggPromise)
  .then((gameData) => {
    gameData.forEach((data, index) => {
      // console.log("before:", data.play_time_min);
      console.log(data.description);
      const parsedDescription = JSON.stringify(
      (
      data.description) 
        .replace(/\\/g, '')
        .replace(/"/g, "'")
        .replace(/\n/g, '')
      );
      console.log(parsedDescription)
      sqlQuery += `(
        ${JSON.stringify(parseInt(data.id))},
        ${JSON.stringify(data.name)},
        ${parsedDescription},
        ${JSON.stringify(parseInt(data.yearpublished))},
        ${JSON.stringify(parseInt(data.age.min))},
        ${JSON.stringify(parseInt(data.playtime.min))},
        ${JSON.stringify(parseInt(data.playtime.max))},
        ${JSON.stringify(parseInt(data.id))},
        ${JSON.stringify(parseFloat(data.rating))}, 
        ${JSON.stringify(data.thumbnail)},
        ${JSON.stringify(data.image)},
        ${JSON.stringify(data.categories.join(", "))},
        ${JSON.stringify(data.mechanics.join(", "))})`
      for (let [key, value] of Object.entries(data)) {
        // console.log(`${key}: ${JSON.stringify(value)}`);
      }
      // console.log('index:', index, "\ndata:", data)

      index === gameData.length - 1 ? sqlQuery += ';\n' : sqlQuery += ',\n'
    })

    return sqlQuery
  }

  )
  .then((sqlSeedQuery) => {
    // console.log(sqlSeedQuery)
    fs.writeFileSync('seed.sql', sqlSeedQuery)
    // let text = (fs.readFileSync('bgg-data.txt', 'utf8'));
    // console.log(text)
  })

