const router = require("express").Router();
const { response } = require("express");
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Post = require('../models/Post');

//UPDATE
router.route('/:id')
    .put(async (req, res) => {
        if (req.body.userId === req.params.id) {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            try {
                const updatedUser = await User.findByIdAndUpdate(req.params.id,
                    { $set: req.body },
                    { new: true });
                res.status(200).json(updatedUser);
                res.end();
            }
            catch (err) {
                res.status(500).json(err);
                res.end();
            }
        } else {
            response.status(401).json("YOu can update only your account");
        }
    })
    //DELETE
    .delete(async (req, res) => {
        if (req.body.userId === req.params.id) {
            try {
                const user = await User.findById(req.params.id)
                if (user) {
                    await Post.deleteMany({ username: user.username });
                    await User.findByIdAndDelete(req.params.id);
                    res.status(200).json("User and thier posts have been deleted...");
                    res.end();
                }
                else {
                    res.status(400).json("User does not exist...");
                    res.end();
                }
            } catch (err) {
                res.status(500).json(err);
                res.end();
            }


        } else {
            response.status(401).json("You can delete only your account");
        }
    })
    //GET
    .get(async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            const { password, ...others } = user._doc
            res.status(200).json(others);
            res.end();
        }
        catch (err) {
            res.status(500).json(err);
            res.end();
        }
    })

module.exports = router;