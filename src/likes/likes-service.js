const LikesService = {
  getLikes(knex) {
    return knex.select("*").from("likes");
  },
  insertLike(knex, newLike) {
    return knex
      .insert(newLike)
      .into("likes")
      .returning("*")
      .then((row) => {
        return row[0];
      });
  },
  serializeLike(like) {
    return {
      id: like.id,
      post_id: like.post_id,
      user_id: like.user_id,
    };
  },
};

module.exports = LikesService;
