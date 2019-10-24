const getAllUsers = (db) => {
  return db.query(`
    SELECT * FROM users;
  `)
    .then(res => res.rows);
};


const getUserById = (db, userId) => {
  return db.query(`
    SELECT * FROM users WHERE id = $1
  `, [userId])
    .then(res => res.rows);

};

module.exports = {
  getAllUsers,
  getUserById
}