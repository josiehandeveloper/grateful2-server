const { expect } = require("chai");
const knex = require("knex");
const { test } = require("mocha");
const supertest = require("supertest");
const app = require("../src/app");
const { makePostsArr } = require("./test-helpers");
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
    let user = {
      email: "testuser@test.com",
      username: "testuser1",
      password: "P@ssword1234",
    };
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

  it(`responds with 200 and an empty list`, () => {
    return db.raw("TRUNCATE TABLE posts RESTART IDENTITY CASCADE").then(() => {
      return supertest(app)
        .get("/api/feed")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200, []);
    });
  });
  it(`responds with 200 and one post`, () => {
    return supertest(app)
      .get("/api/feed")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an("array");
        expect(res.body.content).to.eql(testPosts.content);
      });
  });

  it("creates a post and responds with 201 and the object", () => {
    const newPost = {
      content: "test1",
    };
    return supertest(app)
      .post("/api/feed")
      .send(newPost)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(201)
      .expect((res) => {
        expect(res.body.content).to.eql(newPost.content);
        expect(res.headers.location).to.eql(`/feed`);
      })
      .then((postRes) => {
        /*return supertest(app)
          .get(`/api/movies/${postRes.body.id}`)
          .set("Authorization", `Bearer ${authToken}`)
          .expect(postRes.body);*/
        return true;
      });
  });

  it("responds with 204 and removes the post", () => {
    const idToRemove = 2;
    const expectedPosts = testPosts.filter((post) => post.id !== idToRemove);
    return supertest(app)
      .delete(`/api/dashboard`)
      .send({ post_id: idToRemove })
      .set("Authorization", `Bearer ${authToken}`)
      .expect(204);
  });
});
