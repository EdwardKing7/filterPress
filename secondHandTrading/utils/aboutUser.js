const redis = require('./Redis');
const { config } = require('./getConfig');

async function getUserInfoByTokenId(tokenId){
    let result = {};
    if (tokenId) {
        let userInfoStr = await redis.getByDb(config.redis.logindb, tokenId);
        if (userInfoStr) {
            result.status = "success";
            console.log("userInfoStr",userInfoStr);
            result.userInfo = {"userInfo": JSON.parse(userInfoStr)};
        } else {
            result.status = "error";
            result.msg = "未查到数据";
        }
    } else {
        result.status = "error";
        result.msg = "tokenId不能为空！";
    }
    return result;
}

module.exports = {
    getUserInfoByTokenId
}