const knex = require("knex");
const bcrypt = require("bcryptjs");

const UserService = {
  hasUserWithEmail(knex, email) {
    return knex("users")
      .where({ email })
      .first()
      .then((user) => !!user);
  },
  hasUserWithUsername(knex, username) {
    return knex("users")
      .where({ username })
      .first()
      .then((user) => !!user);
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then((rows) => rows[0]);
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
};

module.exports = UserService;
