const express = require("express");
const router = express.Router();
const Post = require("../models/Post.js");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploadedPosts");
    },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            image: req.file.path,
            publishedDate: new Date(),
            text: req.body.text,
            flag: req.body.flag,
            eventDate: req.body.eventDate ? new Date(req.body.eventDate) : null,
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const postID = req.params.id;
        const oldPost = await Post.findById(postID);
        const updatedPost = await Post.findByIdAndUpdate(
            postID,
            {
                title: req.body.title,
                image: req.file ? req.file.path : req.body.image,
                publishedDate: new Date(req.body.publishedDate),
                text: req.body.text,
                flag: req.body.flag,
                eventDate: req.body.eventDate
                    ? new Date(req.body.eventDate)
                    : null,
            },
            { new: true }
        );
        if (oldPost && oldPost.image) {
            fs.unlink(oldPost.image, (imageNotFound) => {
                if (imageNotFound) {
                    console.error(imageNotFound);
                }
            });
        }
        if (!updatedPost) {
            return res
                .status(404)
                .json({ message: "UPS! Nie moge znaleść tego posta" });
        }
        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const postID = req.params.id;
        const post = await Post.findByIdAndDelete(postID);
        if (post && post.image) {
            fs.unlink(post.image, (postNotFound) => {
                if (postNotFound) {
                    console.error(postNotFound);
                }
            });
        }

        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().sort({ publishedDate: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/flaggedPosts", async (req, res) => {
    try {
        const posts = await Post.find({ flag: true }).sort({
            publishedDate: -1,
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/datted", async (req, res) => {
    try {
        const now = new Date();
        const posts = await Post.find({
            $and: [{ eventDate: { $ne: null } }, { eventDate: { $gt: now } }],
        })
            .sort({
                eventDate: 1,
            })
            .limit(3);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/allDatted", async (req, res) => {
    try {
        const now = new Date();
        const posts = await Post.find({
            $and: [{ eventDate: { $ne: null } }, { eventDate: { $gt: now } }],
        }).sort({
            eventDate: 1,
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const postID = req.params.id;
        const post = await Post.findById(postID);
        if (!post) {
            return res
                .status(404)
                .json({ message: "UPS! Nie moge znaleść tego posta" });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
