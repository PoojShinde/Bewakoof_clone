const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },// Default role is "user"
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

module.exports = mongoose.model("User", userSchema);
