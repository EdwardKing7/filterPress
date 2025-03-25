//about redis
const Redis = require('ioredis');
const { config } = require('./getConfig');

// 创建 Redis 客户端实例，默认连接到本地 Redis 服务器（localhost:6379）
let redisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
});

function connectRedis() {
    try {
        redisClient = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password
        });
    } catch (error) {
        console.error('连接redis出错：', error);
    }
}
connectRedis();
// 定期检查并维护最小空闲连接数，放弃此方案，改用抛异常时才重新连接一次！
setInterval(connectRedis, config.redis.reconnectionInterval);


// 处理 Redis 连接错误
redisClient.on('error', (err) => {
    console.error('Redis 连接出错:', err);
});

// 处理 Redis 连接成功事件
redisClient.on('connect', () => {
    console.log('已成功连接到 Redis 服务器');
});

async function get(key){
    try {
        return await redisClient.get(key);
    } catch (error) {
        try {
            console.log("get操作，第一次没有获取到连接，redis重新建立了连接");
            // 如果因为redis断开连接导致的异常，再重新连接一次，而且只尝试这一次，防止redis服务器被过度连接
            connectRedis();
            return await redisClient.get(key);
        } catch (error) {
            console.error('redis获取数据时出错:', error);
            return null;
        }
    }
}

async function set(key,value){
    try {
        await redisClient.set(key, value);
    } catch (error) {
        try {
            console.log("set操作，第一次没有获取到连接，redis重新建立了连接");
            // 如果因为redis断开连接导致的异常，再重新连接一次，而且只尝试这一次，防止redis服务器被过度连接
            connectRedis();
            await redisClient.set(key, value);
        } catch (error) {
            console.error('redis存数据时出错:', error);
        }
    }
}

async function setBydb(db,key,value){
    try {
        // 创建 Redis 客户端并选择数据库，这里选择数据库 2
        const redisClient = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password,
            db: db
        });
        await redisClient.set(key, value);
    } catch (error) {
        console.error('redis存数据时出错:', error);
    }
}

async function getByDb(db, key){
    try {
        // 创建 Redis 客户端并选择数据库，这里选择数据库 2
        const redisClient = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password,
            db: db
        });
        return await redisClient.get(key);
    } catch (error) {
        console.error('redis获取数据时出错:', error);
        return null;
    }
}

async function setBydbAndExp(db,key,value,seconds){
    try {
        // 创建 Redis 客户端并选择数据库，这里选择数据库 2
        const redisClient = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password,
            db: db
        });
        await redisClient.setex(key, seconds, value);
    } catch (error) {
        console.error('redis存数据时出错:', error);
    }
}

async function deleteBydb(db,key){
    let msg = "";
    try {
        // 创建 Redis 客户端并选择数据库，这里选择数据库 2
        const redisClient = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password,
            db: db
        });
        const result = await redisClient.del(key);
        if (result === 1) {
            msg = `Key ${key} 已成功删除`;
        } else {
            msg = `Key ${key} 不存在`;
        }
    } catch (error) {
        console.error('删除redis数据时出错:', error);
        msg = '删除redis数据时出错';
    }
    return msg;
}

module.exports = {
    get,
    set,
    setBydb,
    getByDb,
    setBydbAndExp,
    deleteBydb
}