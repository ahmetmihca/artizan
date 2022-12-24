const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    required: true
  },

  name: String,
  username: String,
  nonce: String,
  bio: String,
  watchlist: [String],
  favoriteNFTs: [
    {
      contract: String,
      tokenID: Number
    }
  ]
})

const User = mongoose.model('User', userSchema);
module.exports = User;