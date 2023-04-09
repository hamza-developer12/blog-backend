const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const createBlog = async (req, res) => {
    const { title, description, image, author } = req.body;
    let existingUser;
    const authorId = new mongoose.Types.ObjectId(author);
    try {
        existingUser = await User.findById(authorId);
        if (!existingUser) {
            return res.status(400).json({ msg: "Author Not Found" })
        }

        const newPost = new Blog({
            title,
            description,
            image,
            author: existingUser._id,
        })

        await newPost.save();
        await existingUser.blogs.push(newPost);
        await existingUser.save();
        return res.status(200).json({ msg: "Blog Created Successfully" });

    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
const getAllPosts = async (req, res) => {
    let posts;
    try {
        posts = await Blog.find().populate('author', ('-password -email'));
        if (!posts) {
            return res.status(404).json({ msg: "No Posts Found" });
        }
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
const getByUser = async (req, res) => {
    const id = req.params.id;
    let post;
    try {
        post = await User.findById(id, ('-password -email')).populate('blogs');
        if (!post) {
            return res.status(400).json({ msg: "Error" });
        }
        return res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const updatePost = async (req, res) => {
    const id = req.params.id;

    let { title, description, author, image } = req.body;
    const authorId = new mongoose.Types.ObjectId(author);
    try {
        let getPostByUser = await Blog.findById(id).where({ author: authorId });

        if (!getPostByUser) {
            return res.status(400).json({ msg: "Only Author can update Post" });
        }
        let updatedPost = await Blog.findByIdAndUpdate(getPostByUser._id, { title, description, image });

        await updatedPost.save();
        return res.status(200).json({ msg: "Post Updated" });

    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

const deletePost = async (req, res) => {
    const id = req.params.id;
    let user;
    let post;
    try {
        post = await Blog.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ msg: "Blog not found" });
        }
        user = await User.findById(post.author);
        if (!user) {
            return res.status(404).json({ msg: "Author not found" })
        }
        await user.blogs.pull(post._id);
        await user.save();
        return res.status(200).json({ msg: "Post Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }

}
module.exports = {
    createBlog: createBlog, getByUser: getByUser, getAllPosts: getAllPosts,
    updatePost: updatePost, deletePost: deletePost,
}