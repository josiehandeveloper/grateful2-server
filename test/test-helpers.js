const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../src/config");

function makeUsersArr() {
  return [
    {
      email: "test-user-1@test.com",
      password: "Test-user-1!",
      username: "testuser1",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      email: "test-user-2@test.com",
      password: "Test-user-2!",
      username: "testuser2",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      email: "test-user-3@test.com",
      password: "Test-user-3!",
      username: "testuser3",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function makePostsArr(users) {
  return [
    {
      content: "test1",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      content: "test2",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      content: "test3",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function makeExpectedPost(users, post) {
  const user = users.find((user) => user.id === post.user_id);

  return {
    id: post.id,
    content: post.content,
    datecreated: post.datecreated.toISOString(),
    user_id: {
      id: user.id,
      email: user.email,
      datecreated: user.datecreated.toISOString(),
    },
  };
}

function makeMoviesFixtures() {
  const testUsers = makeUsersArr();
  const testMovies = makeMoviesArr(testUsers);
  return { testUsers, testMovies };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        "posts",
        "users"
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE posts_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('posts_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into("posts")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function seedPostsTables(db, users, posts) {
  return db.transaction(async (trx) => {
    await trx.into("users").insert(users);
    await trx.into("posts").insert(posts);

    await Promise.all([
      trx.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id]),
      trx.raw(`SELECT setval('movies_id_seq', ?)`, [
        movies[movies.length - 1].id,
      ]),
    ]);
  });
}

function seedMaliciousMovie(db, user, movie) {
  return seedUsers(db, [user]).then(() => db.into("movies").insert([movie]));
}

function makeAuthHeader(user, secret = config.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArr,
  makePostsArr,
  makeExpectedPost,
  makeMoviesFixtures,
  cleanTables,
  seedPostsTables,
  makeAuthHeader,
  seedUsers,
};
