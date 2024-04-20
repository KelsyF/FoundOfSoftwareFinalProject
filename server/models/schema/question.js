const mongoose = require("mongoose");

// Schema for questions
module.exports = mongoose.Schema(
    {
        //id: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        text: { type: String, required: true },
        asked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        ask_date_time: { type: Date, required: true },
        views: { type: Number, default: 0 },
        answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
    },
    { collection: "Question" }
);
