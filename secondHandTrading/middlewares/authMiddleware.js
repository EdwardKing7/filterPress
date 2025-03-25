const { config } = require('../utils/getConfig');
const aboutUser = require('../utils/aboutUser');
const redis = require('../utils/Redis');

// 全局中间件，用于校验登录状态
const authMiddleware = async (req, res, next) => {
    const uri = req.path;
    //从req当中获取tokenId
    const tokenId = getTokenIdFromReq(req);
    //只要用户处于登录状态，如果处于登录状态，则确保一定要刷新缓存
    const isLogined = await isAuthenticated(tokenId);
    if (!uri) {
        next();
    } else {
        if (!uri.startsWith("/api/")) {
            next();
        } else {
            // 定义不需要校验登录状态的接口
            const unprotectedRoutes = config.noNeedLogin;
            // 检查当前请求的 URL 是否在不需要校验的列表中
            if (unprotectedRoutes.includes(req.path)) {
                console.log(uri,"是登录白名单接口，放行！");
                // 如果是不需要校验的接口，直接放行
                next();
            } else {
                
                console.log("登录状态校验中间件, 检查接口：",req.logId, "tokenId", tokenId);
                if (tokenId) {
                    // 否则，进行登录状态校验
                    if (isLogined) {
                        // 如果用户已登录，继续处理请求
                        next();
                        return;
                    }
                }

                // 下面代码是当被认为需要登录时强制用户页面跳转到登录页去登录
                // 判断是否为 AJAX 请求（通过 Axios 的默认请求头特征）
                const isAjax = req.xhr || req.headers.accept?.includes('application/json');
                // 设置无缓存响应头
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');
                if (isAjax) {
                    // 返回 JSON 提示前端跳转
                    return res.status(403).json({
                        code: 403,
                        redirect: '/login' // 跳转目标路径
                    });
                } else {
                    // 普通请求直接重定向
                    return res.redirect('/login');
                }
            }
        }
    }
};

//从req当中获取tokenId
function getTokenIdFromReq(req) {
    const headers = req.headers;
    console.log("getTokenIdFromReq headers",headers);
    let tokenId = null;
    if (headers) {
        tokenId = headers.tokenid;
    }
    if (!tokenId) {
        const queryBody = req.body;
        if (queryBody) {
            tokenId = queryBody.tokenId;
        }
        if (!tokenId) {
            const queryParams = req.query;
            if (queryParams) {
                tokenId = queryParams.tokenId;
            }
        }
    }
    return tokenId;
}

// 检验是否已经登录，如果发现已经登录，则刷新登录的缓存时间
async function isAuthenticated(tokenId) {
    const userInfo = await aboutUser.getUserInfoByTokenId(tokenId);
    if (userInfo.status === "success") {
        const newUserInfo = userInfo.userInfo.userInfo;
        await redis.setBydbAndExp(config.redis.logindb, tokenId, JSON.stringify(newUserInfo), config.redis.loginExpireSeconds);
        return true;
    }
    return false;
};



module.exports = authMiddleware;