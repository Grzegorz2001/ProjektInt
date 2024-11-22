const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const postsRoutes = require("./routes/posts.js");
const kudosRoutes = require("./routes/kudos.js");

const app = express();

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

app.use("/api/posts", postsRoutes);
app.use("/api/kudos", kudosRoutes);

module.exports = app;
