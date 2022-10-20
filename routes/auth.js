const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//REGISTER
router.route('/register')
    .post(async (req, res, next) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPass
            })

            newUser.save()
                .then((user) => {
                    res.status(200).json(user);
                }).catch((err) => {
                    res.status(500).json(err);
                })
        }
        catch (err) {
            res.status(500).json(err);
        }
    })

//Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        const validated = await bcrypt.compare(req.body.password, user.password);

        if (!user) {
            res.status(400).json("wrong credentials!");
            res.end();
        }
        else if (!validated) {
            res.status(400).json("wrong credentials!");
            res.end();
        } else {
            //helps get everything but password
            const { password, ...others } = user._doc;
            res.status(200).json(others);
            res.end();
        }
    } catch (err) {
        res.status(500).json("holy fuck");
        res.end();
    }
})

module.exports = router;