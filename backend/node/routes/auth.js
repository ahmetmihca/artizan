const recoverPersonalSignature = require("eth-sig-util");
const express = require('express')
const { json } = require('express/lib/response')
const User = require('../models/user')
const router = express.Router()
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const auth = require('../middlewares/auth');

async function authenticate(nonce, signature) {
    try {
        const address = recoverPersonalSignature.recoverPersonalSignature({
            data: nonce,
            sig: signature
        })

        let user = await User.findOne({
            id: address,
            nonce: nonce
        })

        if (user == null) {
            return null
        }
        return user
    } catch {
        return null
    }
}

router.post('/login', async (req, res) => {

    // Exists at the backend but lost the access token
    if (req.session.user != null) {
        let re = req.session.user;
        re["token"] = generateAccessToken(req.session.user.id)
        res.json({ "token": re.token }); //TODO: Change the structure
        return;
    };

    const { nonce, key } = req.body;

    if (nonce == null || key == null) {
        res.sendStatus(401)
        return
    }

    authenticate(nonce, key)
        .then(user => {

            if (user == null) {
                res.sendStatus(401)
                return
            }


            // Successful login
            req.session.user = user;
            res.json({ "token": generateAccessToken(user.id) });
        })
        .catch(err => {
            console.log("Auth error")
            res.sendStatus(401)
        })
});


router.get('/check', auth, async (req, res) => {
    res.json({ user: req.user });
});

function generateAccessToken(username) {
    return jwt.sign({ "username": username }, process.env["JWT_SECRET"], { expiresIn: "10d" });
}



module.exports = router;