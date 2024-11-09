const express = require("express");
const app = express();
const { port } = require("./config");

const apiRouter = require("./routes/api.js");

// routes
app.use("/", apiRouter);

// server
app.listen(port, function () {
    console.log("serwer działa... http://localhost:" + port);
});
