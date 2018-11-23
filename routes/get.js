const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken')

router.get('/api/get', (req, res) =>{
    res.json({
        message: "welcome to get in anodda fileee"
    })
});

router.get('/api/ihealth', (req, res) => {
    res.json({
        message: "welcome to ihealth"
    })
});

router.get('/api/ihealth_remove', (req, res) => {
    res.json({
        message: "sucessfully removed Atria's authorization"
    })
});

module.exports = router