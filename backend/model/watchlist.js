const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
    email : {type : String , required : true},
    coinsId : [{type : String}]
});

module.exports = mongoose.model('Watchlist',WatchlistSchema);