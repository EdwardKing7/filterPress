const mysql = require('mysql2/promise');
const { config } = require('./utils/getConfig');
// 创建数据库连接池
const pool = mysql.createPool({
    host: config.mysql.host, // 数据库主机地址
    user: config.mysql.user, // 数据库用户名
    password: config.mysql.password, // 数据库密码
    database: config.mysql.database, // 数据库名
    port: config.mysql.port, // 数据库端口，默认是 3306，可根据实际情况修改
    waitForConnections: config.mysql.waitForConnections, //当连接池无可用连接时，是否等待
    connectionLimit: config.mysql.connectionLimit, //连接池最大连接数
    queueLimit: config.mysql.queueLimit //连接池最大排队请求数，设置为 0 表示不限制
});

// 手动维护最小空闲连接数
const minIdle = config.mysql.minIdle;

async function maintainMinIdleConnections() {
    try {
        // 获取当前数据库连接数
        const [rows] = await pool.execute('SHOW STATUS LIKE \'Threads_connected\'');
        const currentConnections = parseInt(rows[0].Value);

        // 假设当前没有查询在执行时，连接都可视为空闲（这是一种近似估算）
        // 计算需要创建的连接数
        const needToCreate = minIdle - (config.mysql.connectionLimit - currentConnections);

        if (needToCreate > 0 && currentConnections + needToCreate <= config.mysql.connectionLimit) {
            for (let i = 0; i < needToCreate; i++) {
                const connection = await pool.getConnection();
                connection.release();
            }
        }
    } catch (error) {
        console.error('维护最小空闲连接数时出错:', error);
    }
}

// 定期检查并维护最小空闲连接数
setInterval(maintainMinIdleConnections, 10000); // 每 10 秒检查一次

module.exports = pool;