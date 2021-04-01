const LikesService = {
  getLikes(knex) {
    return knex.select("*").from("posts");
  },
  insertLike(knex, { post_id, count }) {
    return knex("posts")
      .where({ id: `${post_id}` })
      .update({ likes: `${count}` });
    // .into("likes")
    // .returning("*")
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
