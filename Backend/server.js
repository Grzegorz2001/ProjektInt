const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Intranet");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Błąd połączenia z Mongo:"));

const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    publishedDate: Date,
    text: String,
    flag: Boolean,
});

const Post = mongoose.model("Post", postSchema);

app.use(
    cors({
        origin: "http://localhost:5174",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

const upload = multer();

app.post("/api/posts", upload.none(), async (req, res) => {
    console.log(req.body);
    try {
        const nowyPost = new Post(req.body);
        await nowyPost.save();
        res.status(201).json(nowyPost);
    } catch (error) {
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

app.get("/api/posts/strona-glowna", async (req, res) => {
    try {
        const posts = await Post.find({ flag: true });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
