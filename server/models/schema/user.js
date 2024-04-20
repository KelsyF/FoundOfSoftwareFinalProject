const mongoose = require("mongoose");

// Schema for tags
module.exports = mongoose.Schema(
    {
        username: { type: String, required: true},
        password: { type: String, required: true }
    },
    { collection: "User" }
);
