const mongoose = require("mongoose");

const kudosSchema = new mongoose.Schema({
    text: String,
    publishedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Kudos", kudosSchema);
