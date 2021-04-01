const path = require("path");
const express = require("express");
const PostsService = require("./posts-service");
const { requireAuth } = require("../middleware/jwt-auth");
const xss = require("xss");

const postsRouter = express.Router();
const jsonParser = express.json();

postsRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    PostsService.getAllPosts(req.app.get("db"), req.user.id)
      .then((posts) => {
        console.log(posts);
        res.json(posts);
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { content } = req.body;
    const newPost = { content, user_id: req.user.id };

    for (const [key, value] of Object.entries(newPost)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    PostsService.insertPost(req.app.get("db"), newPost)
      .then((post) => {
        res.status(201).location(`/feed`).json(post);
      })
      .catch(next);
  });

// postsRouter
//   .route("/:post_id")
//   .all(requireAuth)
//   .get((req, res) => {
//     res.json(res.post);
//   });

// postsRouter
//   .route("/:post_id")
//   .all(requireAuth)
//   .get((req, res, next) => {
//     PostsService.getAllPostLikes(req.app.get("db"), req.post_id)
//       .then((likes) => {
//         res.json(likes.map(like));
//       })
//       .catch(next);
//   })
//   .patch(requireAuth, jsonParser, (req, res, next) => {
//     const { likes } = req.body;
//     const newPostLike = { likes };
//     console.log(req.body);

//     for (const [key, value] of Object.entries(newPostLike)) {
//       if (value == null) {
//         return res.status(400).json({
//           error: { message: `Missing '${key}' in request body` },
//         });
//       }
//     }

//     PostsService.updatePost(req.app.get("db"), req.params.post_id, newPostLike)
//       .then((numRowsAffected) => {
//         res.status(204).end();
//       })
//       .catch(next);
//   });

module.exports = postsRouter;
