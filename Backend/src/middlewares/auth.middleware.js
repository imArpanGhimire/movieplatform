const jwt = require("jsonwebtoken")

function authmiddlewares(req, res, next) {

    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: "login first"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch (e) {
        console.log(e)
        return res.status(401).json({
            message: "catch block ko error of middleware"
        })
    }


}

module.exports = authmiddlewares