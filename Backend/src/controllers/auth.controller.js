const usermodel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function registeruser(req, res) {
    try {
        const { username, password, role = "user" } = req.body
        if (!username || !password) {
            return res.status(400).json({
                message: "username and password are required"
            })
        }
        const userExists = await usermodel.findOne({
            username
        })

        if (userExists) {
            return res.status(409).json({
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
            role: user.role

        }, process.env.JWT_SECRET)

        res.cookie("token", token)


        res.status(201).json({
            message: "user created.",
            user: {
                username,

                role
            }
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

async function loginuser(req, res) {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({
                message: "username and password are required"
            })
        }

        const user = await usermodel.findOne({ username })
        if (!user) {
            return res.status(401).json({
                message: "user doesn't exists with that details"
            })
        }

        const pswcheck = await bcrypt.compare(password, user.password)
        if (!pswcheck) {
            return res.status(401).json({
                message: "password didnt match"
            })
        }
        const token = jwt.sign({
            id: user._id,
            role: user.role

        }, process.env.JWT_SECRET)
        res.cookie("token", token)
        return res.status(200).json({
            message: "user logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}


async function getusers(req, res) {
    try {
        const users = await usermodel.find({}, "username role")
        if (!users || users.length === 0) {
            return res.status(404).json({
                message: "users dont exist"
            })
        }
        return res.status(200).json({
            message: "users fetched successfully",
            users
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

module.exports = { registeruser, getusers, loginuser }