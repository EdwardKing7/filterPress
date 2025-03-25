//生成指定位数纯数字的函数
function generateRandomNumber(digits) {
    // 确保生成的随机数是指定位数
    if (digits <= 0) {
        return 0;
    }
    // 计算指定位数的最小值和最大值
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    // 生成指定位数的随机整数
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//生成指定位数纯字母的函数
function generateRandomLetters(digits) {
    // 定义包含所有字母的字符串
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let i = 0; i < digits; i++) {
        // 生成一个随机索引，范围是 0 到 letters.length - 1
        const randomIndex = Math.floor(Math.random() * letters.length);
        // 根据随机索引从 letters 字符串中取出一个字符添加到结果中
        result += letters.charAt(randomIndex);
    }

    return result;
}
//生成指定位数字母+数字的函数
function generateRandomAlphanumeric(digits) {
    // 定义包含所有字母和数字的字符串
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < digits; i++) {
        // 生成一个随机索引，范围是 0 到 alphanumeric.length - 1
        const randomIndex = Math.floor(Math.random() * alphanumeric.length);
        // 根据随机索引从 alphanumeric 字符串中取出一个字符添加到结果中
        result += alphanumeric.charAt(randomIndex);
    }

    return result;
}

//根据当前的年、月、日、时、分、秒、毫秒生成一个数字字符串
function generateDateTimeString() {
    const now = new Date();
    const year = String(now.getFullYear()).padStart(4, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const millisecond = String(now.getMilliseconds()).padStart(3, '0');

    return `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
}

//根据当前的年、月、日、时、分、秒、毫秒生成一个数字字符串
function generateDateTimeString() {
    const now = new Date();
    const year = String(now.getFullYear()).padStart(4, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const millisecond = String(now.getMilliseconds()).padStart(3, '0');

    return `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
}


//根据当前的年、月、日生成一个数字字符串
function generateDateString() {
    const now = new Date();
    const year = String(now.getFullYear()).padStart(4, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
}

module.exports = {
    generateRandomNumber,
    generateRandomLetters,
    generateRandomAlphanumeric,
    generateDateTimeString,
    generateDateString
}