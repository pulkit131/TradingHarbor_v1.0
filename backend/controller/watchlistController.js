const watchlist = require('../model/watchlist');

exports.addToWatchlist = async (req,res) => {
    try{
        const {emailId,coinId} = req.params;
        const Watchlist = await watchlist.findOne({email : emailId});
        if(!Watchlist){
            const newWatchlist = new watchlist({ email: emailId, coinsId: [coinId]});
            await newWatchlist.save();
            return res.status(200).json({message : "Watchlist created and coin added"});
        }
        if(Watchlist.coinsId.includes(coinId)) return res.status(409).json({error : "Coin is already in watchlist"});
        Watchlist.coinsId.push(coinId);
        await Watchlist.save();
        res.status(200).json({message : "Added to watchlist"});
    }catch(err){
        res.status(500).json({error : err.message});
    }
};

exports.deleteFromWatchlist = async (req,res) => {
    try{
        const {emailId,coinId} = req.params;
        const Watchlist = await watchlist.findOne({email : emailId});
        if(!Watchlist) return res.status(404).json({error : "Watchlist not found"});
        if(!Watchlist.coinsId.includes(coinId)) return res.status(400).json({error : "Coin is not in watchlist"});
        const index = Watchlist.coinsId.indexOf(coinId);
        Watchlist.coinsId.splice(index,1);
        await Watchlist.save();
        res.status(200).json({message : "Coin removed from Watchlist"});
    }catch(err){
        res.status(500).json({error : err.message});
    }
};

exports.getAllCoinsFromWatchlist = async (req,res) =>{
    try{
        const {emailId} = req.params;
        const Watchlist = await watchlist.findOne({email : emailId});
        if(!Watchlist) return res.status(200).json([]);
        const coins = Watchlist.coinsId;
        res.status(200).json(coins);
    }catch(err){
        res.status(500).json({error : err.message});
    }
};