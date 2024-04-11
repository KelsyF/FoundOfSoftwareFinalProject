// user.model.js (Example File Name)
const mongoose = require("mongoose");
const userSchema = require("./schema/user"); // Assuming the path is correct

const User = mongoose.model("User", userSchema);

module.exports = User;
