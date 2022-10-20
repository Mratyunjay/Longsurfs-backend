const router = require("express").Router();
const { response } = require("express");
const User = require('../models/User');
const Post = require('../models/Post');

router.route('')
    //CREATE
    .post(async (req, res) => {
        try {
            const newPost = new Post(req.body);
            const savePost = await newPost.save();
            res.status(200).json(savePost);
            res.end();
        }
        catch (err) {
            res.status(500).json(err);
            res.end();
        }
    })


//GET ALL POSTS
router.get("/", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
        let posts;
        if (username) {
            posts = await Post.find({ username });
        } else if (catName) {
            //make a note of this method of finding in arrays
            posts = await Post.find({
                categories: {
                    $in: [catName]
                }
            });
        }
        else {
            posts = await Post.find({});
        }

        res.status(200).json(posts);
        res.end();
    }
    catch (err) {
        res.status(500).json(err);
        res.end();
    }
})

router.route('/:id')
    //GET
    .get(async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            res.status(200).json(post);
            res.end();
        }
        catch (err) {
            res.status(500).json(err);
            res.end();
        }
    })
    .put(async (req, res) => {

        try {
            const post = await Post.findById(req.params.id);
            if (post.username === req.body.username) {
                try {
                    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                        $set: req.body
                    }, { new: true });
                    response.status(200).json(updatedPost);
                    res.end();
                } catch (err) {
                    res.status(500).json(err);
                    res.end();
                }
            }
            else {
                response.status(401).json("You can update only your post");
            }
        }
        catch (err) {
            res.status(500).json(err);
            res.end();
        }

    })
    //DELETE
    .delete(async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (post.username === req.body.username) {
                try {
                    await post.delete();
                    response.status(200).json("Post deleted...");
                    res.end();
                } catch (err) {
                    res.status(500).json(err);
                    res.end();
                }
            }
            else {
                response.status(401).json("You can delete only your post");
            }
        }
        catch (err) {
            res.status(500).json(err);
            res.end();
        }
    })


module.exports = router;