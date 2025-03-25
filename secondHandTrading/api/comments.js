// api/users.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const dateFormatUtil = require('../utils/dateFormat');

// 获取所有商品评论的接口
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM comments where is_del = 0');
        res.json(rows);
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

// 获取所有商品评论的接口
router.get('/getCommentsByProductCode', async (req, res) => {
    try {
        const { productCode } = req.query;
        console.log("productCode",productCode,req.query);
        if (productCode) {
            const [rows] = await pool.execute('SELECT * FROM comments where is_del = 0 and product_code = ? order by add_time desc', [ productCode ]);
            if (rows) {
                rows.forEach(row=>{
                    row.add_time = dateFormatUtil.getSimpleDateStrFromDate(row.add_time);
                    row.update_time = dateFormatUtil.getSimpleDateStrFromDate(row.update_time);
                });
            }
            res.json(rows);
        }
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

// 给商品新增新评论的接口
router.post('/save', async (req, res) => {
    try {
        const params = req.body;
        console.log(req.logId, params);
        if (params) {
            const commentText = params.commentText;
            const userInfo = params.userInfo;
            const productInfo = params.productInfo;
            const addTime = dateFormatUtil.getDateStrFromDate(new Date());
            if (!commentText) {
                res.json({"status":"error","msg":"评论内容不能为空！"});
                return;
            }
            if (!userInfo) {
                res.json({"status":"error","msg":"用户信息不能为空！"});
                return;
            }
            if (!productInfo) {
                res.json({"status":"error","msg":"产品信息不能为空！"});
                return;
            }

            const [result] = await pool.execute(`INSERT INTO comments (product_code, 
                                        product_name, 
                                        user_account, 
                                        user_name, 
                                        comment, 
                                        add_time, 
                                        update_time, 
                                        is_del) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [productInfo.product_code, 
                                                                                    productInfo.product_name, 
                                                                                    userInfo.account,
                                                                                    userInfo.name,
                                                                                    commentText,
                                                                                    addTime,
                                                                                    addTime,
                                                                                    0
                                                                                ]);
            res.json({ "status": "success" });
        }
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

module.exports = router;