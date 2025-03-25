// api/users.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const dateFormatUtil = require('../utils/dateFormat');

// 获取企业所有留言的接口
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM messages where is_del = 0');
        res.json(rows);
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

// 添加企业新留言的接口
router.post('/save', async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;
        const addTime = dateFormatUtil.getDateStrFromDate(new Date());
        const clientIP = req.ip;
        console.log(req.logId,"bodyParams",req.body);
        const [result] = await pool.execute(`INSERT INTO messages (user_name, 
                                                                    user_phone, 
                                                                    user_email, 
                                                                    user_message, 
                                                                    add_time, 
                                                                    update_time, 
                                                                    is_del,
                                                                    ip
                                                                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [name, phone, email, message, , addTime, addTime, 0, clientIP]);
        res.redirect('/contactus?addmassages=success');
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

module.exports = router;