const router = require("express").Router();
const Category = require('../models/Category');

router.route('/')
    .post(async (req, res) => {
        const newCat = new Category(req.body);
        try {
            const savedCat = await newCat.save();
            res.status(200).json(savedCat);
            res.end();
        } catch (error) {
            res.status(500).json(errors);
            res.end();
        }
    })
    .get(async (req, res) => {
        try {
            const cats = await Category.find({});
            res.status(200).json(cats);
            res.end();
        } catch (error) {
            res.status(500).json(err);
            res.end();
        }
    })

module.exports = router;

