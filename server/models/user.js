// user.model.js (Example File Name)
const mongoose = require("mongoose");

const User = require("./schema/user"); // Assuming the path is correct

module.exports = mongoose.model("User", User);

