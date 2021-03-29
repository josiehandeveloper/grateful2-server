const express = require("express");
const path = require("path");
const LikesService = require("../likes/likes-service");
const { requireAuth } = require("../middleware/jwt-auth");

const likesRouter = express.Router();
const jsonBodyParser = express.json();

likesRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    LikesService.getLikes(req.app.get("db"))
      .then((likes) => {
        res.json(likes);
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { post_id, count, user_id } = req.body;
    const newLike = { post_id, count, user_id };
    console.log(req.body);

    for (const [key, value] of Object.entries(newLike)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    LikesService.insertLike(req.app.get("db"), newLike)
      .then((like) => {
        res.status(201).json(LikesService.serializeLike(like));
      })
      .catch(next);
  });

module.exports = likesRouter;
