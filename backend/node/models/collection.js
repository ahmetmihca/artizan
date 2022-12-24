const mongoose = require("mongoose");
const User = require("./user").schema;
const Schema = mongoose.Schema;

// const collectionSchema = new Schema({
//   name: String,
//   description: String,
//   category: String,

//   earning: Number,

//   visited: Number,
//   watched: Number,
//   floorPrice: Number,

//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },

// })


const collectionSchema = new Schema({
  name: String,
  description: String,
  category: String,

  earning: Number,

  visited: Number,
  watched: Number,
  floorPrice: Number,

  owner_id: String,
  wallet_id: String,
  NFTs: []
})

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;