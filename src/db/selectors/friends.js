const getFriendsByUserID = (db, userID) => {
  return db.query(`
    Select user2_id AS friend_id 
    FROM friends 
    where user1_id = $1 
    AND is_accepted IS TRUE
  `, [userID])
    .then(res => res.rows)
    .catch(err => console.log('Error getFriendsByUserID:', err));
};

module.exports = {
  getFriendsByUserID
}