const express = require("express");
const multer = require("multer");
const Entry = require("../models/Entry");
const auth = require("../middleware/authMiddleware");
const router = express.Router();
const path = require("path");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Images Only!"));
    }
});

router.post("/", auth, upload.single("image"), async (req, res) => {
    try {
        const { title, description, latitude, longitude, address } = req.body;
        if (!req.file) return res.status(400).json({ message: "No image uploaded" });

        const newEntry = new Entry({
            user: req.user.id,
            title,
            description,
            imageUrl: `/uploads/${req.file.filename}`,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            address
        });

        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const entries = await Entry.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: "Entry not found" });
        if (entry.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

        await Entry.findByIdAndDelete(req.params.id);
        res.json({ message: "Entry removed" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
