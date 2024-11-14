const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/uploadedPosts", express.static("uploadedPosts"));
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Intranet");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Błąd połączenia z Mongo:"));

const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    publishedDate: String,
    text: String,
    flag: Boolean,
});

const Post = mongoose.model("Post", postSchema);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploadedPosts");
    },
});

const upload = multer({ storage: storage });

app.post("/api/posts", upload.single("image"), async (req, res) => {
    try {
        const nowyPost = new Post({
            title: req.body.title,
            image: req.file.path,
            publishedDate: req.body.publishedDate,
            text: req.body.text,
            flag: req.body.flag,
        });
        await nowyPost.save();
        res.status(201).json(nowyPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.delete("/api/posts/:id", async (req, res) => {
    try {
        const postID = req.params.id;
        const post = await Post.findByIdAndDelete(postID);
        if (post && post.image) {
            fs.unlink(post.image, (postNotFound) => {
                if (postNotFound) {
                    console.error(postNotFound);
                } else {
                    alert("Post został usunięty!");
                }
            });
        }

        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.get("/api/posts", async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/api/posts/flaggedPosts", async (req, res) => {
    try {
        const posts = await Post.find({ flag: true });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => console.log(`Serwer działa! Port: ${PORT}`));
