const express = require('express');
const app = express();
const router = express.Router()
// const jwt = require('jsonwebtoken')
// const axios = require('axios');
// var bodyParser = require('body-parser')
const path = require('path')
const ihealthAuth = require('../iHealth/auth')


router.get('/api/get', (req, res) => {
    res.json({
        message: "welcome to get in anodda fileee"
    })
});

router.get('/api/ihealth/auth_inprogress', (req, res) => {
    // let reqURL = decodeURI(req)
    let AcessCode = req.query.code
    let uid = req.query.uid;
    

    if(AcessCode){
        ihealthAuth.AccessToken(AcessCode, uid).then((resp) =>{
            // console.log(resp)
            if (resp === "success")
                res.sendFile('success.html', { root: path.join(__dirname, '../public/iHealthAuth') })
            else
                // res.json({resp})
                res.sendFile('failure.html', { root: path.join(__dirname, '../public/iHealthAuth') })

        })
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