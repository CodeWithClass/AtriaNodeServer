const express = require('express');
const app = express();
const router = express.Router()
// const jwt = require('jsonwebtoken')
// const axios = require('axios');
// var bodyParser = require('body-parser')
const path = require('path')

router.get('/api/get', (req, res) => {
    res.json({
        message: "welcome to get in anodda fileee"
    })
});

router.get('/api/ihealth/auth_inprogress', (req, res) => {
    // console.log(req.url)
    let reqURL = decodeURI(req.url)
    let AcessCode = reqURL.split('code=')[1]
    if(AcessCode){
        console.log(AcessCode)

        res.sendFile('success.html', { root: path.join(__dirname, '../public/iHealthAuth') })
    }
    else{
        res.sendFile('failure.html', { root: path.join(__dirname, '../public/iHealthAuth') })
    }
    
    // res.sendFile('index.html', { root: path.join(__dirname, '../HomePage') })

    

    
});

router.get('/api/ihealth/auth_finished')

router.get('/api/ihealth_remove', (req, res) => {
    res.json({
        message: "sucessfully removed Atria's authorization"
    })
});

module.exports = router