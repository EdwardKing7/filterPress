// api/items.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { config } = require('../utils/getConfig');
const dateFormatUtil = require('../utils/dateFormat');

// 根据产品id查询产品的接口
router.get('/getProductById', async (req, res) => {
    try {
        // 获取查询参数
        const { productId } = req.query;
        console.log(req.logId, productId);
        if(productId){
            // 执行 SQL 查询
            const [[productRow]] = await pool.execute("select * from products where is_del=0 and id = ?", [ productId ]);
            console.log(req.logId, productRow);
            if( productRow ){
                productRow.product_pic_src = config.imagesServer + productRow.product_pic_src;
                productRow.add_time = dateFormatUtil.getDateStrFromDate(productRow.add_time);
                let productCode = productRow.product_code;
                // 执行 SQL 查询
                const [productDetailRow] = await pool.execute("select * from pic_pro_detail where is_del=0 and product_code = ?", [ productCode ]);
                if( productDetailRow ){
                    let mappedDetail = productDetailRow.map(detail => config.imagesServer + detail.pic_src);
                    console.log(req.logId, mappedDetail);
                    productRow.detail_pics = mappedDetail;
                }
                res.json({data: productRow});
            } else {
                res.json({status: "error", msg: "not found data!", productId: productId});
            }
            
        } else {
            res.json({status: "error", msg: "productId can not be null!", productId: productId});
        }
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

// 产品列表检索接口
router.get('/search', async (req, res) => {
    try {
        // 获取查询参数
        const { name, sortByPublish, sortByPublishOrder, sortByPrice, sortByPriceOrder, sortByExpectPrice, sortByExpectPriceOrder,isBargain, page = 1, limit = 10 } = req.query;
        console.log(req.logId, req.query);
        // 构建 SQL 查询语句和参数数组
        let sql = 'SELECT * FROM products WHERE is_del=0';
        const values = [];

        // 产品名称模糊搜索
        if (name) {
            sql += ' AND LOWER(product_name) LIKE ?';
            values.push(`%${name}%`);
        }

        // 根据是否砍价进行筛选
        if (isBargain) {
            const isBargainBool = isBargain === 'true' ? 1 : 0;
            sql += ' AND bargain_allowed = ?';
            values.push(isBargainBool);
        }

        const validOrder1 = sortByPublishOrder === 'desc' ? 'DESC' : 'ASC';
        const validOrder2 = sortByPriceOrder === 'desc' ? 'DESC' : 'ASC';
        const validOrder3 = sortByExpectPriceOrder === 'desc' ? 'DESC' : 'ASC';
        // 排序
        if (sortByPublish) {
            if (sortByPrice) {
                if (sortByExpectPrice) {
                    sql += ` ORDER BY ${sortByPrice} ${validOrder2}, ${sortByExpectPrice} ${validOrder3}, ${sortByPublish} ${validOrder1}`;
                } else {
                    sql += ` ORDER BY ${sortByPrice} ${validOrder2}, ${sortByPublish} ${validOrder1}`;
                }   
                
            } else {
                if (sortByExpectPrice) {
                    sql += ` ORDER BY ${sortByExpectPrice} ${validOrder3}, ${sortByPublish} ${validOrder1}`;
                } else {
                    sql += ` ORDER BY ${sortByPublish} ${validOrder1}`;
                }
            }
        } else {
            if (sortByPrice) {
                if (sortByExpectPrice) {
                    sql += ` ORDER BY ${sortByPrice} ${validOrder2}, ${sortByExpectPrice} ${validOrder3}, add_time DESC`;
                } else {
                    sql += ` ORDER BY ${sortByPrice} ${validOrder2}, add_time DESC`;
                }
            } else {
                if (sortByExpectPrice) {
                    sql += ` ORDER BY ${sortByExpectPrice} ${validOrder3}, add_time DESC`;
                } else {
                    sql += ` ORDER BY add_time DESC`;
                }
            }
        }

        // 分页
        const offset = (page - 1) * limit;
        sql += ' limit '+ parseInt(offset) +','+parseInt(limit);
        
        console.log(req.logId, sql);
        console.log(req.logId, values);
        // 执行 SQL 查询
        const [rows] = await pool.execute(sql, values);
        let result = {};
        result.config = config;
        result.list = rows;
        res.json(result);
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

// 根据产品id删除产品的接口
router.get('/deleteProductByCode', async (req, res) => {
    try {
        // 获取查询参数
        const { productCode } = req.query;
        console.log(req.logId, productCode);
        if(productCode){
            // 将时间转换为 MySQL 支持的日期时间格式
            const nowTime = dateFormatUtil.getDateStrFromDate(new Date());
            // 执行 SQL 查询
            await pool.execute("update products set is_del=1 , update_time= ? where is_del=0 and product_code = ?", [ nowTime, productCode ]);
            // await pool.execute("update comments set is_del=1 , update_time= ? where is_del=0 and product_code = ?", [ nowTime, productCode ]);
            // await pool.execute("update pic_pro_detail set is_del=1 , update_time= ? where is_del=0 and product_code = ?", [ nowTime, productCode ]);
            console.log(req.logId,"delete " + productCode + " successfully！");
            res.json({status: "success"});
        } else {
            res.json({status: "error", msg: "productCode can not be null!", productCode: productCode});
        }
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

module.exports = router;