const express = require("express");
const router = express.Router();
const Kudos = require("../models/Kudos");

router.post("/", async (req, res) => {
    try {
        const newKudos = new Kudos(req.body);
        await newKudos.save();
        res.status(201).json(newKudos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const kudosID = req.params.id;
        const kudos = await Kudos.findByIdAndDelete(kudosID);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/latest", async (req, res) => {
    try {
        const kudos = await Kudos.find().limit(3).sort({
            publishedDate: -1,
        });
        res.json(kudos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const kudos = await Kudos.find().sort({
            publishedDate: -1,
        });
        res.json(kudos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
