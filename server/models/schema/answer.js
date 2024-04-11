const mongoose = require("mongoose");

// Schema for answers
module.exports = mongoose.Schema(
    {
        //id: { type: String, required: true, unique: true },
        text: { type: String, required: true },
        ans_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        ans_date_time: { type: Date, required: true }
    },
    { collection: "Answer" }
);
