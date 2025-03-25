// api/items.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { config } = require('../utils/getConfig');
const redis = require('../utils/Redis');
const multer = require('multer');
const dateFormatUtil = require('../utils/dateFormat');
const randomUtil = require('../utils/random');
const fs = require('fs');
var path = require('path');

// 获取所有items的接口
router.get('/', async (req, res) => {
    try {
        const cacheData = await redis.get("items");
        let result = {};
        
        if ( !cacheData ) {
            const [rows] = await pool.execute('SELECT * FROM items where is_del = 0');
            rows.forEach((obj)=>{
                result[obj.item_code] = obj;
            });
            console.log(req.logId,"redis has no items's cache, use db！");
            await redis.set("items", JSON.stringify(result));
        } else {
            console.log(req.logId,"redis has items's cache, use cache！");
            result = JSON.parse(cacheData);
        }
        res.json(result);
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

// 更新items的接口
router.get('/updateCache', async (req, res) => {
    try {
        await updateCache(req.logId);
        res.json({"status": "success"});
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

// 更新使用items表中的数据更新redis中的缓存
async function updateCache(logId){
    await redis.set("items", null);
    const [rows] = await pool.execute('SELECT * FROM items where is_del = 0');
    let result = {};
    rows.forEach((obj)=>{
        result[obj.item_code] = obj;
    });
    console.log(logId,"use db update items's cache！");
    await redis.set("items", JSON.stringify(result));
}

// 使用 multer 处理文件上传
const storage = multer.memoryStorage(); // 使用内存存储文件
const upload = multer({ storage: storage });

// 处理同时接收普通参数和多文件参数的接口
router.post('/save', upload.fields([
    { name: 'singleFile', maxCount: 1 }
]),async (req, res) => {

    let connection;
    try {
        // 获取普通参数
        const bodyParams = req.body;
        console.log(req.logId,"bodyParams",bodyParams);
        if (bodyParams) {
            // 获取数据库连接
            connection = await pool.getConnection();
            // 开始事务
            await connection.beginTransaction();

            await saveItemToDb('cor_profile', bodyParams.companyProfile);
            await saveItemToDb('cor_merit', bodyParams.companyAdvantage);
            await saveItemToDb('copyright_year', bodyParams.copyrightYear);
            await saveItemToDb('cor_name', bodyParams.companySimpleName);
            await saveItemToDb('cor_full_name', bodyParams.companyFullName);
            await saveItemToDb('cor_slogan', bodyParams.companySlogan);
            await saveItemToDb('cor_address', bodyParams.companyAddress);
            await saveItemToDb('cor_phone', bodyParams.companyContact);
            await saveItemToDb('cor_email', bodyParams.companyEmail);
            await saveItemToDb('work_time', bodyParams.companyWorkTime);
            // await saveItemToDb('show_video_url', bodyParams.);

            // 获取文件对象
            const files = req.files;
            // 获取单个文件
            const singleFile = files.singleFile ? files.singleFile[0] : null;
            console.log(singleFile);

            if (singleFile) {
                // 将展示图文件存入服务器，并返回产品展示图存放路径
                const productPicSrc = saveFileToServer(singleFile, "videosCom");
                const showVideoUrl = config.imagesServer + productPicSrc;
                await saveItemToDb('show_video_url', showVideoUrl);
            }

            // 提交事务
            await connection.commit();
        }
        await updateCache(req.logId);
        res.redirect('/corporation');
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    } finally {
        if (connection) {
            // 释放连接
            connection.release();
        }
    }

});

//将上传的文件存入数据库,singleFile：文件对象，fileType：上传文件类型，作为存放目录的一部分
function saveFileToServer(singleFile, fileType){
    // 产品展示图存放路径
    let productPicSrc = null;
    if (singleFile) {
        console.log('文件名:', singleFile.originalname);
        console.log('文件大小:', singleFile.size);
        console.log(singleFile);
        const fileNewName = randomUtil.generateDateTimeString() + randomUtil.generateRandomNumber(5) + path.extname(singleFile.originalname);
        // 存放文件目录
        const variablePath = "secondProducts/" + fileType + "/";
        const uploadDir = config.fileStorageBasePath + variablePath;
        // 检查目录是否存在，如果不存在则创建
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // 目标文件路径
        const destinationFilePath = path.join(uploadDir, fileNewName);
        // 将文件数据写入新文件
        fs.writeFile(destinationFilePath, singleFile.buffer, (err) => {
            if (err) {
                console.error(destinationFilePath, '写入文件时出错:', err);
            } else {
                console.log(destinationFilePath, '文件写入成功');
            }
        });

        // 使用 path.extname 获取文件后缀名
        productPicSrc = variablePath + fileNewName;
    }
    return productPicSrc;
}

// 将某个item保存到数据库中
async function saveItemToDb(itemCode,itemValue){
    // 将时间转换为 MySQL 支持的日期时间格式
    const addTime = dateFormatUtil.getDateStrFromDate(new Date());
    // 执行产品表，将产品的基础数据存入数据库
    const [result] = await pool.execute(`update 
                                            items 
                                         set 
                                            item_value = ?, 
                                            update_time = ?
                                         where 
                                            item_code = ?`, [ 
                                                itemValue,
                                                addTime,
                                                itemCode
                                            ]);
    console.log(result);
}

module.exports = router;