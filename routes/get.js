const express = require("express")
const app = express()
const router = express.Router()
// const jwt = require('jsonwebtoken')
// const axios = require('axios');
// var bodyParser = require('body-parser')
const path = require("path")
const withingsAuth = require("../withings/auth")
const withingsData = require("../withings/fetchdata")
const fitbitAuth = require("../fitbit/auth")
const fitbitData = require("../fitbit/fetchdata")
const fibitSubscribe = require("../fitbit/subscribe")
const formatMLData = require("../machineLearning/formatData")
const basepyUrl = path.join(__dirname, "../machineLearning/base.py")
const verificationCode = "42ca309719f9695e4824043d3788ea2f41a74cb9396d89012cb846065166f24e"
// =============================== Withings ================================>
router.get("/api/say_hi", (req, res) => {
  res.json({
    message: "welcome"
  })
})

router.get("/api/withings/auth", (req, res) => {
  let AccessCode = req.query.code
  let uid = req.query.state
  if (AccessCode) {
    withingsAuth
      .AccessToken(AccessCode, uid)
      .then(resp => {
        console.log(resp)
        if (resp.fbstatus === 200)
          res.sendFile("success.html", {
            root: path.join(__dirname, "../public/withingsAuth")
          })
        else
          res.sendFile("failure.html", {
            root: path.join(__dirname, "../public/withingsAuth")
          })
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    res.sendFile("failure.html", {
      root: path.join(__dirname, "../public/withingsAuth")
    })
  }
})

router.get("/api/withings/refresh_token", (req, res) => {
  let refToken = req.query.RefreshToken
  let uid = req.query.Uid
  withingsAuth
    .RefreshToken(refToken, uid)

    .then(resp => {
      res.json({
        resp
      })
    })
    .catch(err => {
      console.log(err)
    })
})

router.get("/api/withings/fetchdata", (req, res) => {
  let accesstoken = req.query.access_token
  let uid = req.query.Uid
  let date = req.query.date

  withingsData
    .getBPData(accesstoken, uid, date)
    .then(resp => {
      res.json({
        response: resp
      })
    })
    .catch(err => {
      console.log(err)
    })
})

// ============================ Fitbit =======================

router.get("/api/fitbit/auth", (req, res) => {
  let AccessCode = req.query.code
  let uid = req.query.state
  // console.log(AccessCode, 'its all good');

  if (AccessCode) {
    fitbitAuth
      .AccessToken(AccessCode, uid)
      .then(resp => {
        if (resp.fbstatus === 200)
          res.sendFile("success.html", {
            root: path.join(__dirname, "../public/fitbitAuth")
          })
        else
          res.sendFile("failure.html", {
            root: path.join(__dirname, "../public/fitbitAuth")
          })
      })
      .catch(err => {
      })
  } else {
    res.sendFile("failure.html", {
      root: path.join(__dirname, "../public/fitbitAuth")
    })
  }
})

router.get("/api/fitbit/refresh_token", (req, res) => {
  let refToken = req.query.RefreshToken
  let firebaseUID = req.query.Uid
  fitbitAuth
    .RefreshToken(refToken, firebaseUID)

    .then(resp => {
      res.json({
        resp
      })
    })
    .catch(err => {
      console.log(err)
    })
})

router.get("/api/fitbit/fetchdata", (req, res) => {
  const fitbitUID = req.query.fitbit_uid
  const accessToken = req.query.access_token
  const refreshToken = req.query.refreshToken
  const firebaseUID = req.query.firebase_uid
  const date = req.query.date

  fitbitData
    .fetchData(fitbitUID, accessToken, firebaseUID, date, refreshToken)
    .then(resp => {
        res.json({
          "response": resp
        })
    })
    .catch(err => {
      console.log(err)
    })
})

//allow fitbit to verify server
router.get("/api/fitbit/webhook", (req, res) => { 
  if (req.query.verify === verificationCode)
    res.status(204).send()
  res.status(404).send()
})

router.get("/api/fitbit/subscribe-for-updates", (req, res) => {
  const { firebaseUID, subscriptionId } = req.query
  fibitSubscribe
    .AddSubscriber(firebaseUID, subscriptionId)
    .then(response => {
      res.json({
        response
      })
    })
    .catch(err => {
      console.log(err)
    })
})





// ============================ ML ============================

router.get("/api/ml", (req, res) => {
  let runPy = new Promise((success, nosuccess) => {
    const { spawn } = require("child_process")
    const pyprog = spawn("python", [basepyUrl])

    pyprog.stdout.on("data", data => {
      success(data)
    })
    pyprog.stderr.on("data", data => {
      nosuccess(data)
    })
  })

  runPy
    .then(resp => {
      let response = formatMLData.formatData(resp)
      res.json({
        response
      })
    })
    .catch(err => {
      let error = formatMLData.formatData(err)
      res.json({
        error
      })
    })
})

module.exports = router
