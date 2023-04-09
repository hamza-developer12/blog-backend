const express = require("express");
const {createBlog, getByUser, getAllPosts, updatePost,deletePost} = require("../controllers/blog-controller");
const router = express.Router();

router.post("/create", createBlog);
router.get("/byuser/:id", getByUser)
router.get("/", getAllPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
// router.post("/login", login);

module.exports = router;