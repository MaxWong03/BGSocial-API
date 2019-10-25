const getAllUsers = (db) => {
  return db.query(`
    SELECT * FROM users;
  `)
    .then(res => res.rows);
};

const createUser = (db) => {
  return db.query(`
  INSERT INTO users (name, nickname, email, password, avatar)
  VALUES ('Max Wong', 'Mad Max', 'maxwong93@gmail.com', '123456', 'https://cdn.vox-cdn.com/thumbor/IKt535q8LMnJDddmLL74TBtzv88=/0x266:1024x949/1280x854/cdn.vox-cdn.com/uploads/chorus_image/image/48942277/N3DS_PokemonSuperMysteryDungeon_MainIllustration_png_jpgcopy.0.0.jpg')
  `)
    .then(() => console.log('Successfully Creating User'))
    .catch(error => console.log("Error Creating User:" ,error));
};


const getUserByFBId = (db, fbId) => {
  return db.query(`
    SELECT * FROM users WHERE fb_id = $1
  `, [fbId])
    .then(res => res.rows[0])
    .catch(error => console.log('getUserByFBId Error:', error));
};

module.exports = {
  getAllUsers,
  getUserByFBId,
  createUser
}