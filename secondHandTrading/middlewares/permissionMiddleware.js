const { config } = require('../utils/getConfig');
const { aboutUser } = require('../utils/aboutUser');

// 全局中间件，用于校验登录状态
const authMiddleware = (req, res, next) => {
    const uri = req.path;
    next();
    
};





module.exports = authMiddleware;