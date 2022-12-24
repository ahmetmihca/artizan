const express = require('express')
const { json } = require('express/lib/response')
const User = require('../models/user')
const uuid = require('uuid');
const axios = require("axios").default
const router = express.Router()
var auth = require("../middlewares/auth");
const formidable = require('formidable');
const fs = require('fs');
const path = require('path')
const Collection = require("../models/collection");
const Nft = require("../models/nft");


const check = require('../middlewares/check');
const { isNumberObject } = require('util/types');

//TODO: logout

router.get('/', async (req, res) => {

    if (Object.keys(req.query).length == 0) {
        res.json({ 'resp': 'user endpoint' });
        return
    }

    const walletID = req.query.publicAdress
    if (walletID != null && check.validateWalletID(walletID)) {
        console.log("here")
        let user = await User.findOne({
            id: req.query.publicAdress.toLocaleLowerCase()
        });

        if (user == null) {
            let nonce = uuid.v4();

            await User.create({
                id: req.query.publicAdress.toLocaleLowerCase(),
                username: req.query.publicAdress.toLocaleLowerCase(),
                nonce
            });

            res.status(200)
            res.json({ 'user': user });
        }
        else {
            res.status(200)
            res.json({ 'user': user });
        }
    }
    else {
        res.status(400);
        res.send("-");
    }

})


router.post('/update', auth, async (req, res) => {

    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        let user = await User.findOne({
            id: req.user.id,
        })

        await user.update({
            name: fields.name,
            username: fields.username,
            bio: fields.bio
        });
        if(files.avatar)
        {
            move_img(files.avatar.filepath, req.user.id, "avatar");
        }
        

        res.status(200)
        res.json({ "updated": user });
    });
})


router.get('/find/:id', auth, async (req, res) => {
    let user = await User.findOne({
        id: "x0x0as",
    })

    if (user != null) {
        res.json(user)
    }
})

router.get('/watchlist', auth, async (req, res) => {
    // let user_with_watchlist = await req.user.populate('watchlist');
    // res.json(user_with_watchlist);
    let watchlist = req.user.watchlist

    detailed = []
    for (let i = 0; i < watchlist.length; i++) {
        detailed.push(
            await Collection.findOne({ _id: watchlist[i] })
        )
    }

    res.json({
        "watchlist": detailed.map(ele => ({
            "_id": ele._id,
            "name": ele.name,
            "description": ele.description
        }))
    })
});

router.post('/add-watchlist/', auth, async (req, res) => {

    const { collection_id } = req.body;
    console.log(req.user.watchlist);

    let collection = await Collection.findOne({
        _id: collection_id
    })

    if (collection == null) {
        res.status(404);
        res.json("not found");
        return;
    }

    if (new Set(req.user.watchlist).has(collection_id)) {
        res.json({
            "status": "Already exists",
            "watchlist": req.user.watchlist
        })

        return
    }

    if (collection.watched == null || collection.watched < 0) collection.watched = 0
    collection.watched++
    collection.save()

    req.user.watchlist.push(collection._id + "");
    req.user.save();

    res.json({
        "status": "Added",
        "watchlist": req.user.watchlist
    });
});

router.post('/remove-watchlist', auth, async (req, res) => {

    const { collection_id } = req.body;

    let collection = await Collection.findOne({
        _id: collection_id
    })

    if (collection == null) {
        res.status(404);
        res.json("not found");
        return;
    }

    if (!new Set(req.user.watchlist).has(collection_id)) {
        res.json({
            "status": "User was not following given collection",
            "watchlist": req.user.watchlist
        });

        return
    }

    req.user.watchlist = req.user.watchlist.filter(item => { return item != collection_id })
    req.user.save();

    collection.watched--
    collection.save()

    res.json({
        "status": "Removed",
        "watchlist": req.user.watchlist
    });
});

router.post('/add-favorite-nft', auth, async (req, res) => {

    const { contract, token } = req.body

    if (isNaN(token) || !check.validateContractID(contract)) {
        res.sendStatus(400)
        return
    }

    const token_int = parseInt(token)

    let fav = { "contract": contract, "tokenID": token_int }
    // check the existance of fav
    let favorited = req.user.favoriteNFTs

    for (let i = 0; i < favorited.length; i++) {
        if (favorited[i].contract == fav.contract && favorited[i].tokenID == fav.tokenID) {
            res.json({
                "status": "already favorited",
                "favorites": favorited
            })
            return
        }
    }

    // if fav does not exist
    // push
    req.user.favoriteNFTs.push(fav)
    req.user.save()

    res.json({
        "status": "favorite added",
        "favorites": req.user.favoriteNFTs
    })

    let nft = await Nft.findOne(fav)

    if (nft != null) {
        if (nft.favorited == null || nft.favorited < 0) nft.favorited = 0
        nft.favorited++

        nft.save()
    }
})

router.post('/remove-favorite-nft', auth, async (req, res) => {

    const { contract, token } = req.body

    if (isNaN(token) || !check.validateContractID(contract)) {
        res.sendStatus(400)
        return
    }

    const token_int = parseInt(token)

    let fav = { "contract": contract, "tokenID": token_int }

    // check the existance of fav
    let favorited = req.user.favoriteNFTs

    for (let i = 0; i < favorited.length; i++) {
        if (favorited[i].contract == fav.contract && favorited[i].tokenID == fav.tokenID) {

            req.user.favoriteNFTs.splice(i, 1)
            req.user.save()
            res.json({
                "status": "deleted",
                "favorites": req.user.favoriteNFTs
            })

            let nft = await Nft.findOne(fav)
            console.log("NFT: ", nft)

            if (nft != null) {
                if (nft.favorited == null || nft.favorited <= 0) nft.favorited = 1
                nft.favorited--

                nft.save()
            }

            return
        }
    }

    res.json({
        "status": "there is no such favorite",
        "favorites": favorited
    })
})

router.get('/favorites', auth, async (req, res) => {

    let favoriteNFTs = req.user.favoriteNFTs;

    res.json({ favoriteNFTs });
});

router.get('/favorites/:user', async (req, res) => {

    let favoriteNFTs;
    console.log(req.params["user"])
    try {
        if (req.params["user"]) {
            let ussr = await User.findOne({
                id: req.params["user"]
            })
            console.log(ussr)

            favoriteNFTs = ussr.favoriteNFTs
        }
        else {
            favoriteNFTs = []
        }
    }
    catch (err) {
        favoriteNFTs = []
    }

    res.json({
       favoriteNFTs
    })
})


router.get('/created/:user', async (req, res) => {

    let createdNFTs;
    console.log(req.params["user"])
    try {
        if (req.params["user"]) {
            
            let nfts = await Nft.find({
                creator: req.params["user"].toLocaleLowerCase()
            }) 

            createdNFTs = nfts
        }
        else {
            createdNFTs = []
        }
    }
    catch (err) {
        createdNFTs = []
    }

    res.json({
        createdNFTs
    })
})

function move_img(oldPath, id, type) {
    var newPath = path.join(__dirname, '/..') + '/public/users/' + id + `_${type}.png`
    var rawData = fs.readFileSync(oldPath)

    fs.writeFile(newPath, rawData, function (err) {
        if (err) console.log(err)
    })
}


module.exports = router;