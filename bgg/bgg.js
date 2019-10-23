const bgg = require('boardgamegeek');
const fs = require('fs');

// bgg.getBoardGameById('43730')
//   .then(data => console.log(data));

const bggPromise = [];
let sqlQuery = 'INSERT INTO games (id, name, description, year_published, age, play_time_min, play_time_max, bgg_id, average_bgg_rating, thumbnail, image, category, mechanic) VALUES\n'




for (let i = 1; i <= 1; i++) {
  bggPromise.push(bgg.getBoardGameById(i))
}

Promise.all(bggPromise) 
  .then((gameData) => {
    gameData.forEach((data, index) => {

      // sqlQuery += `(${data.id}, ${data.name}, ${data.description}, ${data.year_published}, ${data.age}, ${data.play_time_min}, ${data.play_time_max}, ${data.bgg_id}, ${data.average_bgg_rating}, ${data.thumbnail}, ${data.image}, ${data.category}, ${data.mechanic})`

      console.log('index:', index, "\ndata:", data)

      index === gameData.length - 1 ? sqlQuery += ',\n' : sqlQuery += ';\n'
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

