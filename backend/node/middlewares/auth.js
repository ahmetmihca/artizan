const jwt = require('jsonwebtoken');
const User = require("../models/user");


module.exports = async function auth(req, res, next) {

    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    await jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = await User.findOne({
            id: user.username
        });

        next()
    })
}; 