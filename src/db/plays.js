/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

// const todosColumnsNames = [
//   'title',
//   'description',
//   'start_date',
//   'end_date',
//   'priority',
//   'complete',
//   'cover_photo_url',
//   'todo_id',
//   'category_id',
// ];

// const getUserById = function (db, id) {
//   return db
//     .query(`SELECT * FROM users WHERE id = $1;`, [id])
//     .then(res => res.rows[0]);
// };

const getPlaysByUserId = function (db, userId) {
  return db.query(`SELECT plays_users.* FROM plays_users JOIN plays ON plays_users.play_id = plays.id WHERE plays_users.user_id = $1`, [userId])
    .then(res => res.rows);
};

// const addCategory = function (db, category) {
//   return db.query(`INSERT INTO categories (description, user_id, cover_photo_url, main_category)
//     VALUES ($1, $2, $3, $4) RETURNING *;`, [category.description, category.user_id, category.cover_photo_url, category.main_category])
//     .then(res => res.rows[0]);
// };

// const deleteCategory = function (db, id, userId) {
//   return db.query(`DELETE FROM categories WHERE id = $1 AND user_id = $2`, [id, userId]);
// };

// const updateCategory = function (db, editableCategory) {
//   return db.query(`UPDATE categories SET description = $1, cover_photo_url = $2, main_category = $3 WHERE user_id = $4 AND id = $5 RETURNING *;`
//     , [editableCategory.description, editableCategory.cover_photo_url, editableCategory.main_category, editableCategory.user_id, editableCategory.id])
//     .then(res => res.rows[0]);
// };

// const getTodosByCategoryId = function (db, userId, categoryID) {
//   return db.query(`SELECT * FROM todos JOIN categories ON todos.category_id = categories.id WHERE
//   categories.user_id = $1 AND categories.id = $2`, [userId, categoryID])
//     .then(res => res.rows);
// };

// const getTodosByUserId = function (db, userId) {
//   return db.query(`SELECT todos.* FROM todos JOIN categories ON todos.category_id = categories.id WHERE
//   categories.user_id = $1`, [userId])
//     .then(res => {
//       return res.rows});
// };

// const getTodoById = function (db, userId, todoId) {
//   return db.query(`SELECT todos.* FROM todos JOIN categories ON todos.category_id = categories.id WHERE
//   categories.user_id = $1 AND todos.id = $2`, [userId, todoId])
//     .then(res => res.rows[0]);
// };

// const updateTodo = function (db, todo, userId) {
//   const validColumns = todosColumnsNames.filter(column => column in todo);
//   const values = validColumns.map(column => todo[column]);

//   const sets = values.map((value, index) => `${validColumns[index]} = $${index + 1}`)

//   values.push(todo.id);
//   values.push(userId);

//   let query = `UPDATE todos
//     SET ${sets.join(', ')}
//     WHERE id = $${values.length - 1} AND todos.category_id = ANY(
//       SELECT id FROM categories WHERE categories.user_id = $${values.length})
//     RETURNING *;`

//   return db.query(query, values)
//     .then(res => res.rows[0]);
// };

// const addTodo = function (db, todo) {
//   const validColumns = todosColumnsNames.filter(column => column in todo);
//   const indexArray = validColumns.map((column, index) => `$${index + 1}`)
//   const values = validColumns.map(column => todo[column]);

//   return db.query(`INSERT INTO todos (${validColumns.join(', ')})
//     VALUES (${indexArray.join(', ')}) RETURNING *;`, values)
//     .then(function(res) {
//       return res.rows[0];
//     });
// };

// const deleteTodo = function (db, id, userId) {
//   return db.query(`DELETE FROM todos WHERE todos.id = $1 AND todos.category_id = ANY(
//     SELECT id FROM categories WHERE user_id = $2)`, [id, userId]);
// };

// module.exports = {
//   addCategory, getUserById,
//   getPlaysByUserId, deleteCategory, updateCategory, getTodosByCategoryId,
//   getTodosByUserId, getTodoById, addTodo, updateTodo, deleteTodo
// };

module.exports = {
  getPlaysByUserId
};


