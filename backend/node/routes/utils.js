const express = require('express')
const { json } = require('express/lib/response')
const User = require('../models/user')
const uuid = require('uuid');
const axios = require("axios").default
const router = express.Router()
var auth = require("../middlewares/auth");
const Collection = require('../models/collection');
const Nft = require('../models/nft');
const { query } = require('express');


//TODO: dondurulecek data azaltilacak

router.get('/explore', async (req,res) => {
    const page = (req.query.page == null || +req.query.page == NaN || +req.query.page < 1) ? 1 : +req.query.page
    if(req.query.type == "asset"){
        let assets = await Nft.find({}).sort({favorited:-1}).skip(page*10 - 10).limit(10)
        let data = assets.map(
            (val) => 
            {
                console.log(val)
                return {
                    contract: val.contract,
                    tokenID: val.tokenID,
                    metadata: {
                        imgURL: val.metadata.imgURL,
                        name: val.metadata.name,
                    },
                    favorited: val.favorited,
                };
            }
        )

        res.json(data)
        return
    }

    if(req.query.type == "collection"){
        let assets = await Collection.find({}).sort({watched:-1}).skip(page*10 - 10).limit(10);
        let data = assets.map(
            (val) => 
            {
                return {
                    NFTCount : val.NFTs.length,
                    _id: val._id,
                    name: val.name,
                    owner_id: val.owner_id,
                    watched: val.watched,
                    wallet_id: val.wallet_id
                };
            }
        )
        res.json(data)
        return
    }

    res.status(400).send("Invalied query type")
})

router.get('/search', async (req, res) => {
    //TODO: verify the security of regex search
    const { type, search, id } = req.query;

    try {

        if (!/^(\w|\s){1,100}$/.test(search)) {
            res.status(400).type("text/plain").send('Search query length must be in range [3,100]. Also search query should not include characters other than [a,z] [A,Z] [0,9] and space( )')
            return
        }

        console.log(search, type)
        if (type == "collection") {

            let collections;
            if (id != null) {
                try {
                    collections = await Collection.find({
                        _id: id
                    })
                } catch(e){
                    collections = [];
                }
            }
            else {
                collections = await Collection.find({
                    name: { '$regex': `(?i)${search}` }
                })
            }

            res.json(collections);
            return;
        }

        if (type == "asset") {
            let assets = await Nft.find({
                '$or': [
                    { "metadata.name": { '$regex': `(?i)${search}` } }, // (?i) means case insesitive
                    { "metadata.description": { '$regex': `(?i)${search}` } }, // (?i) means case insesitive
                ]
            })

            res.json(assets);
            return
        }

        if (type == "user") {
            let users = await User.find({
                '$or': [
                    { username: { '$regex': `(?i)${search}` } }, // (?i) means case insesitive
                    { name: { '$regex': `(?i)${search}` } }, // (?i) means case insesitive
                ]
            })

            res.json(
                users.map((fields) => ({
                    "username": fields.username,
                    "name": fields.name,
                    "bio": fields.bio,
                    "id": fields.id,
                    "join date": fields._id.getTimestamp().toISOString().split('T')[0]
                })
                )
            );
            return;
        }

        console.log(type);
        res.json(type)
    }
    catch (err) {
        console.log("Search error:", err)
        res.sendStatus(500)
    }

})


router.get('/explore', async (req,res) => {
    const page = (req.query.page == null || +req.query.page == NaN || +req.query.page < 1) ? 1 : +req.query.page
    if(req.query.type == "asset"){
        let assets = await Nft.find({}).sort({favorited:-1}).skip(page*10 - 10).limit(10)

        res.json(assets)
        return
    }

    if(req.query.type == "collection"){
        let assets = await Collection.find({}).sort({watched:-1}).skip(page*10 - 10).limit(10);
        let data = assets.map(
            (val) => 
            {
                console.log(val)
                return {
                    NFTCount : val.NFTs.length,
                    _id: val._id,
                    name: val.name,
                    owner_id: val.owner_id,
                    watched: val.watched,
                    wallet_id: val.wallet_id
                };
            }
        )
        res.json(data)
        return
    }

    res.status(400).send("Invalied query type")
})


module.exports = router;