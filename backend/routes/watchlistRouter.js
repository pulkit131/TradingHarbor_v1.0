const express = require('express');
const router = express.Router();
const watchlistController = require('../controller/watchlistController');
const {auth} = require('../middleware/auth');

router.get('/:emailId',auth,watchlistController.getAllCoinsFromWatchlist);
router.post('/:emailId/:coinId',auth,watchlistController.addToWatchlist);
router.delete('/:emailId/:coinId',auth,watchlistController.deleteFromWatchlist);