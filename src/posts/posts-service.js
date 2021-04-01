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
};

module.exports = PostsService;
