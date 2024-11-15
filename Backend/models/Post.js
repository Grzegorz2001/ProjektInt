const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    publishedDate: { type: Date, default: Date.now },
    text: String,
    flag: Boolean,
});

module.exports = mongoose.model("Post", postSchema);
