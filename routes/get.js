const express = require('express');
const app = express();
const router = express.Router()
// const jwt = require('jsonwebtoken')
// const axios = require('axios');
// var bodyParser = require('body-parser')
const path = require('path')
const withingsAuth = require('../withings/auth')


// =============================== iHealth ================================>

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
});

router.get('/api/ihealth/auth_finished')

router.get('/api/ihealth_remove', (req, res) => {
    res.json({
        message: "sucessfully removed Atria's authorization"
    })
});
// ===========================================================================>



// =============================== Withings ================================>
router.get('/api/withings', (req, res)=>{
    res.json({
        message: 'welcome'
    })
})

router.get('/api/withings/auth', (req, res) => {
    let AcessCode = req.query.code
    let uid = req.query.state;
    // console.log(AcessCode)
    if (AcessCode) {
        withingsAuth.AccessToken(AcessCode, uid)
        
        .then((resp) => {
            console.log(resp)
            if (resp === "success")
                res.sendFile('success.html', { root: path.join(__dirname, '../public/iHealthAuth') })
            else
                res.sendFile('failure.html', { root: path.join(__dirname, '../public/iHealthAuth') })
        })
        .catch(err=>{console.log(err)})
    }
    else {
        res.sendFile('failure.html', { root: path.join(__dirname, '../public/iHealthAuth') })
    }
});

router.get('/api/withings/refresh_token', (req, res) => {
    let refToken = req.query.RefreshToken
    let uid = req.query.Uid;
    withingsAuth.RefreshToken(refToken, uid)

        .then((resp) => {
            res.json({
                message: 'OK'
            })
        })
        .catch(err => { console.log(err) })
});





module.exports = router