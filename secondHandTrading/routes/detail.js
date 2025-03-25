var express = require('express');
var router = express.Router();
const baseDataMiddleware = require('../middlewares/baseDataMiddleware');

/* GET users listing. */
router.get('/', baseDataMiddleware, function(req, res, next) {
    res.render('detail', { corporationName: req.items.cor_name.item_value, corporationFullName: req.items.cor_full_name.item_value, promotionText: req.items.cor_slogan.item_value});
});
  
module.exports = router;