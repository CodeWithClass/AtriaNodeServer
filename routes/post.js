const express = require('express');
const router = express.Router();
const {ReadFromDb} = require("../helpers/db-helpers")



// =============================== Withings ================================>
router.post('/api/withings/auth', (req, res) => {
    console.log(req)
    res.json({
        message: 'ok'
    })
})

// =============================== fitbit ================================>

router.post("/api/fitbit/webhook", (req, res) => {
    res.status(204).send()

    console.log(req.body[0].subscriptionId)
    const { subscriptionId, collectionType, date}
    const refresh_token = ReadFromDb(subscriptionId, '/fitbitAuth/refresh_token')
    req.body
})

module.exports = router