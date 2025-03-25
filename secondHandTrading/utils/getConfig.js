// 读取配置文件
const fs = require('fs');
var path = require('path');
const configFilePath = path.join(__dirname+'/../', 'config.json');
const configData = fs.readFileSync(configFilePath, 'utf8');
const config = JSON.parse(configData);
module.exports = {
    config
}