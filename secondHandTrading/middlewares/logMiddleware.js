const randomUtil = require('../utils/random');
// 全局中间件，用于校验登录状态
const logMiddleware = (req, res, next) => {
    const uri = req.path;
    const logId = uri + ":" + randomUtil.generateRandomAlphanumeric(15);
    req.logId = logId;
    next();
};





module.exports = logMiddleware;