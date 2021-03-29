const { expect } = require("chai");
const knex = require("knex");
const { test } = require("mocha");
const supertest = require("supertest");
const app = require("../src/app");
const { makeMoviesArr } = require("./test-helpers");
const testHelpers = require("./test-helpers");

describe("Posts Endpoints", function () {
  let db;
  let authToken;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    return app.set("db", db);
  });

  afterEach("cleanup", () =>
    db.raw("TRUNCATE TABLE users, posts RESTART IDENTITY CASCADE")
  );

  beforeEach("register and login", () => {
    let user = { email: "testuser@test.com", password: "P@ssword1234" };
    return supertest(app)
      .post("/api/users")
      .send(user)
      .then((res) => {
        return supertest(app)
          .post("/api/auth/login")
          .send(user)
          .then((res2) => {
            authToken = res2.body.authToken;
          });
      });
  });

  const testUsers = testHelpers.makeUsersArr();
  const testPosts = testHelpers.makePostsArr();

  beforeEach("insert users", () => {
    return db.into("users").insert(testUsers);
  });
  beforeEach("insert posts", () => {
    return db.into("posts").insert(testPosts);
  });

  it.only(`responds with 200 and an empty list`, () => {
    return db.raw("TRUNCATE TABLE posts RESTART IDENTITY CASCADE").then(() => {
      return supertest(app)
        .get("/api/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200, []);
    });
  });
  it(`responds with 200 and one post`, () => {
    return supertest(app)
      .get("/api/posts")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an("array");
        expect(res.body.title).to.eql(testMovies.title);
      });
  });

  it("creates a movie and responds with 201 and the object", () => {
    const newMovie = {
      title: "test1",
      poster_path: "test posterpath",
      vote_average: 7,
      user_id: 1,
      datecreated: "2020-10-21",
    };
    return supertest(app)
      .post("/api/movies")
      .send(newMovie)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(201)
      .expect((res) => {
        expect(res.body.title).to.eql(newMovie.title);
        expect(res.body.poster_path).to.eql(newMovie.poster_path);
        expect(res.headers.location).to.eql(`/movies`);
      })
      .then((postRes) => {
        /*return supertest(app)
          .get(`/api/movies/${postRes.body.id}`)
          .set("Authorization", `Bearer ${authToken}`)
          .expect(postRes.body);*/
        return true;
      });
  });

  it("responds with 204 and removes the movie", () => {
    const idToRemove = 2;
    const expectedMovies = testMovies.filter(
      (movie) => movie.id !== idToRemove
    );
    return supertest(app)
      .delete(`/api/movies/`)
      .send({ movie_id: idToRemove })
      .set("Authorization", `Bearer ${authToken}`)
      .expect(204);
  });
});
