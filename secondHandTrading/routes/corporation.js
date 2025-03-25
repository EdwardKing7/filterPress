var express = require('express');
var router = express.Router();
const baseDataMiddleware = require('../middlewares/baseDataMiddleware');

/* GET users listing. */
router.get('/', baseDataMiddleware, function(req, res, next) {
    console.log(req.items);
    res.render('corporation', { 
        corporationName: req.items.cor_name.item_value, 
        corporationFullName: req.items.cor_full_name.item_value, 
        promotionText: req.items.cor_slogan.item_value,
        corporationProfile: req.items.cor_profile.item_value,
        corporationMerit: req.items.cor_merit.item_value,
        showVideoUrl: req.items.show_video_url.item_value
    });
});
  
module.exports = router;