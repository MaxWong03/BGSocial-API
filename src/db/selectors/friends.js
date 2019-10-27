const getFriendsByUserID = (db, userID) => {
  return db.query(`
    Select * FROM friends where friends.user1_id = $1
  `, [userID])
    .then((data) => console.log(data))
};

module.exports = {
  getFriendsByUserID
}