const fs = require('fs');

let sqlQuery = `INSERT INTO friends (is_accepted, user1_id, user2_id)
VALUES\n`

for (let i = 1; i <= 29; i++) {
  sqlQuery += `(TRUE, 1, ${i+1}),\n`
}

for (let i = 2; i <= 29; i++) {
  sqlQuery += `(TRUE, 2, ${i+1}),\n`
}

for (let i = 3; i <= 29; i++) {
  sqlQuery += `(TRUE, 3, ${i+1})`
  i === 29 ? sqlQuery += ';\n' : sqlQuery += ',\n';
}

fs.writeFileSync('../src/db/seeds/test.sql', sqlQuery);