const PostsService = {
  getAllPosts(knex) {
    return knex.select("*").from("posts").orderBy("date_created", "desc");
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
};

module.exports = PostsService;
