const express = require('express')
const _ = require('lodash')
const router = express.Router()
const { ReadFromDb } = require('../helpers/db-helpers')
const { RefreshAndFetch } = require('../fitbit/auth')

// =============================== Withings ================================>
router.post('/api/withings/auth', (req, res) => {
  console.log(req)
  res.json({
    message: 'ok'
  })
})

// =============================== fitbit ================================>

//fitit calls this endpoint (notifications)
router.post('/api/fitbit/webhook', (req, res) => {
  res.status(204).send()

  _.forEach(req.body, notifi => {
    const { subscriptionId, collectionType, date } = notifi
    ReadFromDb({
      firebaseUID: subscriptionId,
      path: 'fitbitAuth/refresh_token'
    })
      .then(dataSnapshot => {
        let refresh_token = dataSnapshot.val()
        if (refresh_token) {
          RefreshAndFetch(subscriptionId, refresh_token, collectionType, date)
            .then(resp => {})
            .catch(err =>
              console.log(
                'err in post.js, endpoint /api/fitbit/webhook doing refreshandfetch',
                err
              )
            )
        }
      })
      .catch(err => console.log('cant read from db ', err))
  })
})

module.exports = router
