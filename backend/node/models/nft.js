const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const nftSchema = new Schema({
    contract: String,
    tokenID: Number,
    metadata: {
        imgURL: String,
        name: String,
        description: String,
        attributes: []
    },
    favorited: Number,
    price: Number,
    category: String,
    creator: String
})

const Nft = mongoose.model('Nft', nftSchema);
module.exports = Nft;