const PostsService = {
  getAllPosts(knex) {
    return knex.select("*").from("posts").orderBy("date_created", "desc");
  },
  getById(knex, id) {
    return PostsService.getAllPosts(knex).where("post.id", id).first;
  },
  insertPost(knex, newPost) {
    return knex
      .insert(newPost)
      .into("posts")
      .returning("*")
      .then((row) => {
        return row[0];
      });
  },
  deletePost(knex, id) {
    return knex("posts").where({ id }).delete();
  },
  getPostLikes(knex) {
    return knex.select("likes").from("posts");
  },
  updateLike(knex, post_id, likes) {
    return knex("posts").where("id", "=", post_id).update({ likes });
  },
};

module.exports = PostsService;
