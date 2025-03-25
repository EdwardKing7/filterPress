const axios = require('axios');
const { config } = require('../utils/getConfig');
// 定义 fetchDataMiddleware 中间件
const baseDataMiddleware = async (req, res, next) => {
    try {
        const url = 'http://'+config.currentServer+':'+process.env.PORT+'/api/items';
        const response = await axios.get(url);
        const items = response.data;
        req.items = items;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = baseDataMiddleware;