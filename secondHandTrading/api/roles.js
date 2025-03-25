// api/users.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// 获取所有用户的接口
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users where is_del = 0');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 根据 ID 获取单个用户的接口
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE is_del = 0 and id = ?', [userId]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 添加新用户的接口
router.post('/', async (req, res) => {
    const { username, email } = req.body;
    try {
        const [result] = await pool.execute('INSERT INTO users (username, email) VALUES (?, ?)', [username, email]);
        res.status(201).json({ id: result.insertId, username, email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;