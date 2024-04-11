const mongoose = require("mongoose");

// Schema for tags
module.exports = mongoose.Schema(
    {
        //id: { type: String, required: true, unique: true },
        name: { type: String, required: true }
    },
    { collection: "Tag" }
);
