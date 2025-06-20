const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true  // (optional) ensures one watchlist per email
  },
  coinsId: {
    type: [String], // array of strings
    default: []     // default empty array if not provided
  }
});

module.exports = mongoose.model('Watchlist', WatchlistSchema);
