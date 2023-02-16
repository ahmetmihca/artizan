const express = require("express");
const { json, send } = require("express/lib/response");
const uuid = require("uuid");
const axios = require("axios").default;
const router = express.Router();
var auth = require("../middlewares/auth");
const multer = require("multer");
const User = require("../models/user");
const Collection = require("../models/collection");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const Nft = require("../models/nft");
const check = require("../middlewares/check");
const { ObjectId } = require("mongodb");

router.get("/my", auth, async (req, res, next) => {
  let collections = await Collection.find({
    owner_id: req.user._id,
  });

  res.json(collections);
});

router.get("/all", async (req, res) => {
  //TODO: implement direction
  //TODO: searching all may not be a good idea. look how did others do
  let sortBy = req.query.sort;
  let direction = req.query.direction == 1 ? 1 : -1;

  if (
    !new Set(["visited", "watched", "floorPrice", "earning", "name"]).has(
      sortBy
    )
  )
    sortBy = "watched";

  console.log(sortBy, direction);

  let collections;
  console.log(req.query.category);
  if(req.query.category != null){
     collections = await Collection.find({
      category: req.query.category.toLocaleLowerCase()
     }).sort(sortBy);
  }
  else{
    collections = await Collection.find({}).sort(sortBy);
  }

  res.json(
    collections.map((fields) => ({
      _id: fields["_id"],
      name: fields["name"],
      description: fields["description"],
      earning: fields["earning"],
      wathed: fields["watched"],
      visited: fields["visited"],
      floorPrice: fields["floorPrice"],
    }))
  );
});

router.post("/create", auth, async (req, res, next) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    let c = await Collection.create({
      name: fields.name,
      description: fields.description,
      owner_id: req.user._id,
      earning: "0",
      wallet_id: req.user.id
    });

    move_img(files.logo.filepath, c.id, "logo");
    move_img(files.featured.filepath, c.id, "featured");
    move_img(files.banner.filepath, c.id, "banner");

    res.json({ fields, files });
    return;
  });
});

router.post("/changeCategory", auth, async (req, res) => {

  let collection = await Collection.findOne({
    _id : req.body.collectionId,
  })

  if(collection != null){
    // We should check category type
    collection.category = req.body.category.toLocaleLowerCase();
    collection.save();
    res.json({"status": "Category changed"});
  }
  else{
    res.json({"status": "Error occured"});
  }
  
});

router.post("/addToCollection/:collectionId", auth, async (req, res) => {
  //TODO: check if I can add any NFT to my collection
  //TODO: bir NFT birden fazla collectionda olamaz

  const nftID = req.body.nftID;
  const contractID = req.body.contractID;
  const tokenID = req.body.tokenID;

  let nft;
  if (nftID == null) {
    let asd = await Nft.find({})
    console.log(asd)
    if (
      contractID !== null &&
      tokenID !== null 
    ) {
      console.log(+tokenID)
      // console.log(, +tokenID)
      const filter = {
        contract: contractID,
        tokenID: +tokenID,
      };
      console.log({filter});
      nft = await Nft.findOne(filter);
      console.log(nft)

      if (nft == null) {
        res
          .status(435)
          .send("NFT could not found with given contract and token IDs");
        return;
      }
    } else {
      res.sendStatus(400);
      return;
    }
  } else {
    nft = await Nft.findOne({ _id: nftID });
    if (nft == null) {
      res.status(433).send("NFT could not found with given ID");
      return;
    }
  }

  // nft benim mi?
  const isNFTmine = await check.checkNFTOwnership(
    req.user["id"],
    nft.contract,
    nft.tokenID
  );
  if (isNFTmine == false) {
    res.send({ status: "NFT's owner is not you" });
    return;
  }
  // collection var mi?
  // collection benim mi?

  let collection = await Collection.findOne({
    _id: ObjectId(req.params["collectionId"]),
    owner_id: req.user._id,
  });

  if (collection == null) {
    res.sendStatus(431);
    return;
  }

  if (
    collection.NFTs.some((ele) => {
      return ele.contract == nft.contract && ele.tokenID == nft.tokenID;
    })
  ) {
    res.send({
      status: "NFT already exists in collection: " + collection.name,
    });
    return;
  }

  collection.NFTs.push({
    contract: nft.contract,
    tokenID: nft.tokenID,
  });

  collection.save();

  res.send({
    status: "NFT is added to collection: " + collection.name,
  });
  return;
});

router.get("/fromNFT/:contractID/:tokenID", async (req, res) => {
  //TODO: narrow down response
  let collection = await Collection.findOne({
    $and: [
      { "NFTs.contract": req.params.contractID },
      { "NFTs.tokenID": +req.params.tokenID },
    ],
  });

  if (collection == null) {
    res.sendStatus(432);
    return;
  }

  res.json(collection);
});

function move_img(oldPath, id, type) {
  var newPath =
    path.join(__dirname, "/..") + "/public/collections/" + id + `_${type}.png`;
  var rawData = fs.readFileSync(oldPath);

  fs.writeFile(newPath, rawData, function (err) {
    if (err) console.log(err);
  });
}

module.exports = router;
