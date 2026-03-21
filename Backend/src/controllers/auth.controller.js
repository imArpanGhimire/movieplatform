const usermodel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function registeruser(req, res) {
    try {
        const { username, password, role = "user" } = req.body

        const userExists = await usermodel.findOne({
            username
        })

        if (userExists) {
            res.status(409).json({
                message: "another user with that name exists"
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
            message: "user created.",
            user: {
                username,
                password,
                role
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}

async function getusers(req, res) {
    const users = await usermodel.find({}, "username role")
    try {
        if (!users || users.length === 0) {
            res.status(401).json({
                message: "users dont exist"
            })
        }
        res.status(200).json({
            message: "users fetched successfully",
            users
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports = { registeruser, getusers }