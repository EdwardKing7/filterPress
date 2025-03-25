// api/items.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
var path = require('path');

const pool = require('../db');
const { config } = require('../utils/getConfig');
const randomUtil = require('../utils/random');
const dateFormatUtil = require('../utils/dateFormat');
const redis = require('../utils/Redis');

// 使用 multer 处理文件上传
const storage = multer.memoryStorage(); // 使用内存存储文件
const upload = multer({ storage: storage });

// 解析普通表单数据
router.use(express.urlencoded({ extended: true }));

// 处理同时接收普通参数和多文件参数的接口
router.post('/publish', upload.fields([
        { name: 'singleFile', maxCount: 1 },
        { name: 'multipleFiles', maxCount: 10 }
    ]),async (req, res) => {
    
    let connection;
    try {
        // 获取普通参数
        const bodyParams = req.body;
        const queryParams = req.query;
        console.log(req.logId,"bodyParams",bodyParams,"queryParams",queryParams);
        const tokenId = queryParams.tokenId;
        console.log(req.logId,"tokenId",tokenId);
        if (tokenId) {
            let userInfoStr = await redis.getByDb(config.redis.logindb, tokenId);
            if( userInfoStr ){
                const userInfo = JSON.parse(userInfoStr);
                // // 处理文件和普通参数
                console.log(req.logId, "userInfo", userInfo,'普通参数:', { productName: bodyParams.productName, originPrice: bodyParams.originPrice, expectPrice: bodyParams.expectPrice, barginAllowed: bodyParams.barginAllowed, productNum: bodyParams.productNum, productLocation: bodyParams.productLocation, productDescription: bodyParams.productDescription, contactPhone: bodyParams.contactPhone });
                
                // 获取文件对象
                const files = req.files;

                // 获取单个文件
                const singleFile = files.singleFile ? files.singleFile[0] : null;
                // 将展示图文件存入服务器，并返回产品展示图存放路径
                let productPicSrc = saveFileToServer(singleFile, "shows");

                // 获取数据库连接
                connection = await pool.getConnection();
                // 开始事务
                await connection.beginTransaction();

                // 将产品的数据存入MySQL库表，返回该条数据的id
                const productCode = randomUtil.generateRandomNumber(10);
                await saveProductInfoToDb(bodyParams, productPicSrc, productCode, userInfo);
                console.log(req.logId, "productCode：",productCode);
                
                // 处理产品详情用到的文件
                const multipleFiles = files.multipleFiles || [];
                // 可以在这里将文件保存到磁盘或进行其他处理
                if(multipleFiles){
                    console.log(req.logId, '文件数量:', multipleFiles.length);
                    multipleFiles.forEach(async (file) => {
                        console.log(req.logId, '文件名:', file.originalname);
                        console.log(req.logId, '文件大小:', file.size);
                        //对上传的多个文件，逐个文件处理
                        let productFileSrc = saveFileToServer(file, "detail");
                        const insertedId = await saveProductDetailFileToDb(productCode, productFileSrc);
                        console.log(req.logId, "pro-detail-file", insertedId);
                    });
                }
                // 提交事务
                await connection.commit();

                // 文件上传成功后，跳转到产品列表页查看产品
                res.redirect('/product');
                return;
            }
        }
        //未登录的先登录才能发布产品
        res.redirect('/login');
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
// 根据图片的url对图片进行删除
async function logicDeletePicProDetailByPicSrc(picSrc){
    if (picSrc) {
        console.log("要删除的picSrc：",picSrc);
        // 将时间转换为 MySQL 支持的日期时间格式
        const addTime = dateFormatUtil.getDateStrFromDate(new Date());
        // 执行产品表，将产品的基础数据存入数据库
        const [result] = await pool.execute(`update pic_pro_detail set update_time = ?, is_del = 1 where pic_src = ?`, [ addTime, picSrc ]);
        console.log(result);
    }
}

// 根据图片的url对图片进行删除
async function logicDeleteProductPicSrcByPicSrc(picSrc){
    if (picSrc) {
        // 将时间转换为 MySQL 支持的日期时间格式
        const addTime = dateFormatUtil.getDateStrFromDate(new Date());
        // 执行产品表，将产品的基础数据存入数据库
        const [result] = await pool.execute(`update products set update_time = ?, product_pic_src = NULL  where product_pic_src = ?`, [ addTime, picSrc ]);
        console.log(result);
    }
}

// 根据图片的url对图片进行删除
async function updateProductById(productInfo){
    if (productInfo && productInfo.productId) {
        // 将时间转换为 MySQL 支持的日期时间格式
        const addTime = dateFormatUtil.getDateStrFromDate(new Date());
        // 执行产品表，将产品的基础数据存入数据库
        const [result] = await pool.execute(`update products set 
                                                                    update_time = ?, 
                                                                    product_name = ?, 
                                                                    origin_price = ?, 
                                                                    expect_price = ?, 
                                                                    bargain_allowed = ?, 
                                                                    product_desc = ?, 
                                                                    on_sale = ?,
                                                                    sold_time = ?,
                                                                    product_num = ?,
                                                                    like_num = ?,
                                                                    permissions = ?,
                                                                    product_addr = ?,
                                                                    product_owner_phone = ?
                                                                 where 
                                                                    id = ?`, [ 
                                                                    addTime, 
                                                                    productInfo.productName,
                                                                    productInfo.originPrice,
                                                                    productInfo.expectPrice,
                                                                    productInfo.barginAllowed === 'yes'? 1:0,
                                                                    productInfo.productDescription,
                                                                    0,
                                                                    null,
                                                                    productInfo.productNum,
                                                                    0,
                                                                    null,
                                                                    productInfo.productLocation,
                                                                    productInfo.contactPhone,
                                                                    productInfo.productId
                                                                ]);
        console.log(result);
    }
}

// 根据产品的id修改产品的图片src
async function updateProductPicSrcById(productId, picSrc){
    if (productId && picSrc) {
        // 将时间转换为 MySQL 支持的日期时间格式
        const addTime = dateFormatUtil.getDateStrFromDate(new Date());
        // 执行产品表，将产品的基础数据存入数据库
        const [result] = await pool.execute(`update products set 
                                                                    update_time = ?, 
                                                                    product_pic_src = ?
                                                                 where 
                                                                    id = ?`, [ 
                                                                    addTime, 
                                                                    picSrc,
                                                                    productId
                                                                ]);
        console.log(result);
    }
}

// 处理同时接收普通参数和多文件参数的接口
router.post('/updateProduct', upload.fields([
    { name: 'singleFile', maxCount: 1 },
    { name: 'multipleFiles', maxCount: 10 }
]),async (req, res) => {
    let connection;
    try {
        // 获取普通参数
        const bodyParams = req.body;
        const queryParams = req.query;
        console.log(req.logId,"bodyParams",bodyParams,"queryParams",queryParams);
        const tokenId = queryParams.tokenId;
        const ifChangesEncoded = queryParams.ifChanges;
        console.log(req.logId,"tokenId",tokenId,"ifChangesEncoded",ifChangesEncoded);
        

        // 获取数据库连接
        connection = await pool.getConnection();
        // 开始事务
        await connection.beginTransaction();

        if ( ifChangesEncoded ) {
            // 反编码
            const decodeIfChangesStr = decodeURIComponent(ifChangesEncoded);
            // 将字符串改回json对象
            const ifChanges = JSON.parse(decodeIfChangesStr);
            if ( ifChanges.hasChanged ) {
                const showPicDeleted = ifChanges.showPicDeleted;

                const files = req.files;
                // 获取单个文件
                const singleFile = files.singleFile ? files.singleFile[0] : null;
                const urlPre = config.imagesServer;
                if ( !singleFile && showPicDeleted) {
                    showPicDeleted = showPicDeleted.replace(urlPre, "");
                    await logicDeleteProductPicSrcByPicSrc(showPicDeleted);
                }
                const detailPicDeletedList = ifChanges.detailPicDeleted;
                if ( detailPicDeletedList && detailPicDeletedList.length > 0) {
                    detailPicDeletedList.forEach(async detailPicDeleted=>{
                        detailPicDeleted = detailPicDeleted.replace(urlPre, "");
                        await logicDeletePicProDetailByPicSrc(detailPicDeleted);
                    });
                }
                const changeContent = ifChanges.changeContent;

                if ( singleFile ) {
                    const picSrc = saveFileToServer(singleFile, "shows");
                    await updateProductPicSrcById(bodyParams.productId, picSrc);
                }
                if ( changeContent && changeContent.length > 0) {
                    await updateProductById(bodyParams);
                }

                // 处理产品详情用到的文件
                const multipleFiles = files.multipleFiles || [];
                // 可以在这里将文件保存到磁盘或进行其他处理
                if(multipleFiles){
                    console.log(req.logId, '文件数量:', multipleFiles.length);
                    multipleFiles.forEach(async (file) => {
                        console.log(req.logId, '文件名:', file.originalname);
                        console.log(req.logId, '文件大小:', file.size);
                        //对上传的多个文件，逐个文件处理
                        let productFileSrc = saveFileToServer(file, "detail");
                        const insertedId = await saveProductDetailFileToDb(bodyParams.productCode, productFileSrc);
                        console.log(req.logId, "pro-detail-file", insertedId);
                    });
                }
            }
        }
        // 提交事务
        await connection.commit();
        res.redirect('/detail?id='+bodyParams.productId);
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
        const variablePath = "secondProducts/" + fileType + "/" +randomUtil.generateDateString()+"/";
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

//将产品的数据存入MySQL库表
async function saveProductInfoToDb(bodyParams, productPicSrc, productCode, userInfo){
    // 获取当前本地时间
    const now = new Date();
    // 将时间转换为 MySQL 支持的日期时间格式
    const addTime = dateFormatUtil.getDateStrFromDate(now);
    // 执行产品表，将产品的基础数据存入数据库
    const [result] = await pool.execute(`INSERT INTO products 
        (
            product_name, 
            origin_price, 
            expect_price, 
            bargain_allowed, 
            product_desc, 
            product_pic_src, 
            on_sale, 
            add_time, 
            update_time, 
            sold_time, 
            product_num, 
            like_num, 
            permissions, 
            is_del, 
            product_addr, 
            product_owner_phone,
            product_code,
            user_account
        ) 
        VALUES 
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
            bodyParams.productName, 
            bodyParams.originPrice, 
            bodyParams.expectPrice, 
            bodyParams.barginAllowed === 'yes'?1:0, 
            bodyParams.productDescription, 
            productPicSrc, 
            0,
            addTime,
            addTime,
            null,
            bodyParams.productNum,
            0,
            null,
            0,
            bodyParams.productLocation,
            bodyParams.contactPhone,
            productCode,
            userInfo.account
        ]);
    console.log(result);
    // 获取插入数据的主键值
    return result.insertId;
}

//将产品详情用到的文件数据存入MySQL库表
async function saveProductDetailFileToDb(productCode, productPicSrc){
    // 获取当前本地时间
    const now = new Date();
    // 将时间转换为 MySQL 支持的日期时间格式
    const addTime = dateFormatUtil.getDateStrFromDate(now);
    // 执行产品表，将产品的基础数据存入数据库
    const [result] = await pool.execute(`INSERT INTO pic_pro_detail 
        (
            product_code, 
            pic_src, 
            add_time, 
            update_time, 
            is_del
        ) 
        VALUES 
        (?,?,?,?,?)`, [
            productCode, 
            productPicSrc, 
            addTime, 
            addTime, 
            0
        ]);
    console.log(result);
    // 获取插入数据的主键值
    return result.insertId;
}


module.exports = router;