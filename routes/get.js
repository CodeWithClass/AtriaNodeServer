const express = require('express')
const app = express()
const router = express.Router()
const _ = require('lodash')
const path = require('path')
const withingsAuth = require('../withings/auth')
const withingsData = require('../withings/fetchdata')
const fitbitAuth = require('../fitbit/auth')
const { formatMLData } = require('../machineLearning/formatData')
const basepyUrl = path.join(__dirname, '../machineLearning/base.py')
const { formatDate, formatDateDetailed } = require('../helpers/formating')
const recommender = require('../recommender/recommender')

// =============================== Withings ================================>
router.get('/api/say_hi', (req, res) => {
  res.json({
    message: 'welcome'
  })
})

router.get('/api/withings/auth', (req, res) => {
  let AccessCode = req.query.code
  let uid = req.query.state
  if (AccessCode) {
    withingsAuth
      .AccessToken(AccessCode, uid)
      .then(resp => {
        if (_.get(resp, 'fbstatus') === 200)
          res.sendFile('success.html', {
            root: path.join(__dirname, '../public/withingsAuth')
          })
        else
          res.sendFile('failure.html', {
            root: path.join(__dirname, '../public/withingsAuth')
          })
      })
      .catch(err => {
        console.log({ err })
      })
  } else {
    res.sendFile('failure.html', {
      root: path.join(__dirname, '../public/withingsAuth')
    })
  }
})

router.get('/api/withings/refresh_token', (req, res) => {
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

router.get('/api/withings/fetchdata', (req, res) => {
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

router.get('/api/fitbit/auth', (req, res) => {
  let AccessCode = req.query.code
  let uid = req.query.state
  if (AccessCode) {
    fitbitAuth
      .AccessToken(AccessCode, uid)
      .then(resp => {
        if (resp.fbstatus === 200)
          res.sendFile('success.html', {
            root: path.join(__dirname, '../public/fitbitAuth')
          })
        else
          res.sendFile('failure.html', {
            root: path.join(__dirname, '../public/fitbitAuth')
          })
      })
      .catch(err => {})
  } else {
    res.sendFile('failure.html', {
      root: path.join(__dirname, '../public/fitbitAuth')
    })
  }
})

router.get('/api/fitbit/fetchdata', (req, res) => {
  const { firebaseUID, refresh_token, category, date } = req.query
  fitbitAuth
    .RefreshAndFetch(firebaseUID, refresh_token, category, date)
    .then(resp => {
      res.json({
        response: resp
      })
    })
    .catch(err => {
      return err
    })
})

//allow fitbit to verify server
router.get('/api/fitbit/webhook', (req, res) => {
  const verificationCode =
    '42ca309719f9695e4824043d3788ea2f41a74cb9396d89012cb846065166f24e'
  if (req.query.verify === verificationCode) res.status(204).send()
  res.status(404).send()
})

router.get('/api/fitbit/revoketoken', (req, res) => {
  //refresh or access token, doesn't matter
  const { token, firebaseUID } = req.query
  fitbitAuth
    .RevokeToken(token, firebaseUID)
    .then(response => {
      res.json({
        response
      })
    })
    .catch(err => {
      console.log(err)
    })
})

// ============================ Recommender ============================
router.get('/api/recommendation/generate', (req, res) => {
  const { firebaseUID, date } = req.query
  recommender
    .calcRec({ firebaseUID, date })
    .then(resp => {
      res.json({
        response: resp
      })
    })
    .catch(err => {
      console.log(err)
      res.json({
        error: err
      })
    })
})

// ============================ ML ============================

router.get('/api/ml', (req, res) => {
  let runPy = new Promise((success, nosuccess) => {
    const { spawn } = require('child_process')
    const pyprog = spawn('python', [basepyUrl])

    pyprog.stdout.on('data', data => {
      success(data)
    })
    pyprog.stderr.on('data', data => {
      nosuccess(data)
    })
  })

  runPy
    .then(resp => {
      const response = formatMLData(resp)
      res.json({
        response
      })
    })
    .catch(err => {
      const error = formatMLData(err)
      res.json({
        error
      })
    })
})

// ======================== Testing ==========================

router.get('/test/date', (req, res) => {
  res.json({
    reg: formatDate(),
    detailed: formatDateDetailed()
  })
})

router.get('/test/general', (req, res) => {
  const { func } = req.query
  // const data = eval("removeSlpMinData({sleep:[{ hi: 'you' }]})")
  const data = eval(func)

  res.json({
    res: data
  })
})

const { removeSlpMinData } = require('../fitbit/fetchdata')
router.post('/test/general', (req, res) => {
  const { func } = req.query
  const param = req.body
  const data = eval(`${func}(${JSON.stringify(param)})`)

  res.json({
    // res: 'hi'
    ...data
    // ...param
  })
})
module.exports = router
