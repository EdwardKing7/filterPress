// api/users.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const randomUtil = require('../utils/random');
const dateFormatUtil = require('../utils/dateFormat');
const { config } = require('../utils/getConfig');
const redis = require('../utils/Redis');

// 获取所有用户的接口
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

// 添加新用户的注册接口
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        console.log(req.logId,"req body：",req.body);
        const account = randomUtil.generateRandomAlphanumeric(12);
        const addTime = dateFormatUtil.getDateStrFromDate(new Date());
        const insertSql = `INSERT INTO users 
                                                (account, 
                                                name, 
                                                phone, 
                                                email, 
                                                password, 
                                                add_time, 
                                                update_time, 
                                                is_del
                                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(insertSql, [account, name, phone, email, password, addTime, addTime, 0]);
        res.redirect('/login?loginsucess=yes&name='+name+'&account='+account);
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

// 添加新用户检测传参是否合法的接口
router.get('/registerValidate', async (req, res) => {
    try {
        // 获取查询参数
        const { name, email, phone, password } = req.query;
        console.log(req.logId, "请求参数", req.query);
        let questionlist = [];

        if(!name){
            questionlist.push("用户名不得为空！");
        }
        if(!email){
            if(!phone){
                questionlist.push("手机号和邮箱不能同时为空！");
            }
        }
        if(!password){
            questionlist.push("密码不得为空！");
        }

        if ( questionlist.length>0 ) {
            res.json({"status":"error","msg":questionlist});
        } else {
            const [rows] = await pool.execute('SELECT * FROM users WHERE is_del = 0 and (name = ? or email = ? or phone = ?)', [name, email, phone]);
            if (rows.length != 0) {
                let duplicate = {};
                rows.forEach(row=>{
                    if (name ===  row.name) {
                        duplicate.name = name;
                    }
                    if (email ===  row.email) {
                        duplicate.email = email;
                    }
                    if (phone ===  row.phone) {
                        duplicate.phone = phone;
                    }
                });
                let prompt = '注册失败：';
                if (duplicate.name) {
                    prompt = prompt + '昵称：' + duplicate.name + '已被使用。';
                }
                if (duplicate.email) {
                    prompt = prompt + 'email：' + duplicate.email + '已被使用。';
                }
                if (duplicate.phone) {
                    prompt = prompt + '电话：' + duplicate.phone + '已被使用。';
                }
                res.json({"status":"error","msg":prompt});
            } else {
                res.json({"status":"success","msg":"校验通过"});
            }
        }
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

//登录接口
router.post('/login', async (req, res) => {
    try {
        const { complexAccount, password } = req.body;
        console.log(req.logId,"req body：",req.body);
        console.log(req.logId,"complexAccount：",complexAccount,"password：",password);
        const addTime = dateFormatUtil.getDateStrFromDate(new Date());
        //保存用户的登录行为
        const insertSql = `INSERT INTO login_record 
                                                (user_account, 
                                                user_name, 
                                                client_ip, 
                                                inputpass, 
                                                headers, 
                                                add_time, 
                                                update_time, 
                                                is_del
                                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(insertSql, [complexAccount, null, req.ip, password, JSON.stringify(req.headers), addTime, addTime, 0]);
        console.log(req.logId, "result", result);
        const [rows] = await pool.execute('SELECT * FROM users WHERE is_del = 0 and (account = ? or email = ? or phone = ?)', [complexAccount, complexAccount, complexAccount]);
        if (rows.length != 0) {
            let loginSuccess = false;
            let userInfo = {};
            rows.forEach(row=>{
                if (password ===  row.password) {
                    loginSuccess = true;
                    userInfo = row;
                }
            });
            if (loginSuccess) {
                const [rows] = await pool.execute('SELECT * FROM users_roles WHERE is_del = 0 and user_account = ?', [userInfo.account]);
                let roles = [];
                let rolesCodes = [];
                if (rows.length != 0) {
                    roles = rows.map(row=>{
                        return row.role_name;
                    });
                    rolesCodes = rows.map(row=>{
                        return row.role_code;
                    });
                } else {
                    roles.push("普通游客");
                }
                const tokenId = randomUtil.generateRandomAlphanumeric(15);
                delete userInfo.password;
                userInfo.roles = roles;
                userInfo.rolesCodes = rolesCodes;
                await redis.setBydbAndExp(config.redis.logindb, tokenId, JSON.stringify(userInfo), config.redis.loginExpireSeconds);
                res.redirect('/product?loginsucess=yes&tokenId='+tokenId);
                return;
            }
        }
        res.redirect('/login?loginFail=yes');
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

// 根据tokenid获取用户信息
router.get('/getUserInfoByTokenId', async (req, res) => {
    try {
        // 获取查询参数
        const { tokenId } = req.query;
        console.log(req.logId, "tokenId", tokenId);
        let userInfoStr = await redis.getByDb(config.redis.logindb, tokenId);
        let result = {};
        if (userInfoStr) {
            result.status = "success";
            console.log(req.logId,"userInfoStr",userInfoStr);
            result.userInfo = {"userInfo": JSON.parse(userInfoStr)};
        } else {
            result.status = "error";
            result.msg = "未查到数据";
        }
        res.json(result);
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

// 退出登录
router.get('/logout', async (req, res) => {
    try {
        // 获取查询参数
        const { tokenId } = req.query;
        console.log(req.logId, "tokenId", tokenId);
        let result = await redis.deleteBydb(config.redis.logindb, tokenId);
        res.json(result);
    } catch (error) {
        console.error(req.logId, error);
        res.redirect('/servererror');
    }
});

module.exports = router;