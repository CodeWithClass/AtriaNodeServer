const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken')

router.get('/api/get', (req, res) =>{
    res.json({
        message: "welcome to get in anodda fileee"
    })
});

module.exports = router