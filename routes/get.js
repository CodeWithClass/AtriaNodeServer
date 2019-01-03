const express = require('express');
const app = express();
const router = express.Router()
// const jwt = require('jsonwebtoken')
// const axios = require('axios');
// var bodyParser = require('body-parser')
const path = require('path')
const withingsAuth = require('../withings/auth')
const withingsData = require('../withings/fetchdata')
const formatMLData = require('../machineLearning/formatData')
const basepyUrl = path.join(__dirname, '../machineLearning/base.py');


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
            if (resp.fbstatus === 200)
                res.sendFile('success.html', { root: path.join(__dirname, '../public/withingsAuth') })
            else
                res.sendFile('failure.html', { root: path.join(__dirname, '../public/withingsAuth') })
        })
        .catch(err=>{console.log(err)})
    }
    else {
        res.sendFile('failure.html', { root: path.join(__dirname, '../public/withingsAuth') })
    }
});

router.get('/api/withings/refresh_token', (req, res) => {
    let refToken = req.query.RefreshToken
    let uid = req.query.Uid;
    withingsAuth.RefreshToken(refToken, uid)

        .then((resp) => {
            res.json({
                resp
            })
        })
        .catch(err => { console.log(err) })
});


router.get('/api/withings/fetchdata', (req, res) => {
    let accesstoken = req.query.access_token
    let uid = req.query.Uid;
    let date = req.query.date;

    withingsData.getBPData(accesstoken, uid, date)
        .then((resp) => {
            res.json({
                response: resp
            })
        })
        .catch(err => { console.log(err) })
});

router.get('/api/ml', (req, res)=>{

    let runPy = new Promise( (success, nosuccess) => {
        
        const { spawn } = require('child_process');
        const pyprog = spawn('python', [basepyUrl]);

        pyprog.stdout.on('data', (data) => {
            success(data);
        });
        pyprog.stderr.on('data', (data) => {
            nosuccess(data);
        });
    });
    
    runPy.then((resp) =>{
            let response = formatMLData.formatData(resp);
            res.json({
                response,
            });
        })
        .catch((err)=>{
            let error = formatMLData.formatData(err)
            res.json({
                error,
            });
        })
});


module.exports = router