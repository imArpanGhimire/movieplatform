const usermodel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


async function registeruser(req, res) {

    const { username, password, role = "user" } = req.body

    const usernameExists = await usermodel.findOne({
        username
    })

    if (usernameExists) {
        res.status(409).json({
            message: "user with that name already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await usermodel.create({
        username,
        password: hash,
        role
    })

    const token = jwt.sign({
        id: user._id,
        role
    }, process.env.JWT_SECRET)


    res.cookie("token", token)

    res.status(201).json({
        message: "user created successfully",
        user: {
            username: user._id,
            password: user.password,
            role: user.role
        }
    })
}
module.exports = { registeruser }