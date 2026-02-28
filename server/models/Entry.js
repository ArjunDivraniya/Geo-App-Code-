const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Entry", entrySchema);
