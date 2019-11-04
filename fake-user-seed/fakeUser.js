const fs = require('fs');
const faker = require('faker');




let sqlQuery = `INSERT INTO users (id, fb_id, name, nickname, email, avatar)\nVALUES (1, 921623601546635, 'Max Wong', 'Mad Max', 'maxwong93@gmail.com', 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=921623601546635&height=350&width=350&ext=1574626882&hash=AeSZ-ILZTTrn2hrH'),
(2, 2184479695188878, 'Zongxi Li', 'Jesse', 'zongxi@gmail.com', 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2184479695188878&height=350&width=350&ext=1574626952&hash=AeS_rrrvqq3FXxd6'),
(3, 10162376645685203, 'Camilia Riveria', 'CR', 'cr@gmail.com', 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10162376645685203&height=350&width=350&ext=1574633091&hash=AeSTH7BvOEhoPQ07'),\n`;

for (let i = 4; i <= 30; i++) {
  const name = faker.name.findName();
  const email = faker.internet.email();
  const avatar = faker.image.avatar();
  const fbID = faker.random.number();
  sqlQuery += `(
    ${i},
    ${fbID},
    '${name}',
    '${name}',
    '${email}',
    '${avatar}'
  )`
  i === 30 ? sqlQuery += '\n;\n' : sqlQuery += '\n,\n';
}

sqlQuery += "\nSELECT SETVAL('users_id_seq', 50);"

fs.writeFileSync('../src/db/seeds/01_users.sql', sqlQuery);
