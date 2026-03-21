const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,

    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'maker'],
        default: "user"
    }
})


const usermodel = mongoose.model("user", userSchema)

module.exports = usermodel