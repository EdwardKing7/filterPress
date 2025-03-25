function getDateStrFromDate(date){
    // 获取年、月、日、时、分、秒
    const year = date.getFullYear();
    // 月份需要加 1，因为 getMonth() 返回的是 0 - 11
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 拼接成所需的格式
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}

function getSimpleDateStrFromDate(date){
    // 获取年、月、日、时、分、秒
    const year = date.getFullYear();
    // 月份需要加 1，因为 getMonth() 返回的是 0 - 11
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');

    // 拼接成所需的格式
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

module.exports = {
    getDateStrFromDate,
    getSimpleDateStrFromDate
}