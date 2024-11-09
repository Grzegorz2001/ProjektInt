const express = require("express");
const router = express.Router();

const testActions = require("./controllers/api/test.js");

router.get("/", testActions.newsPage);

module.exports = router;
