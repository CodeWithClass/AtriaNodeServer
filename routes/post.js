const express = require('express');
const router = express.Router();
const fitbitData = require("../fitbit/fetchdata")



// =============================== Withings ================================>
router.post('/api/withings/auth', (req, res) => {
    console.log(req)
    res.json({
        message: 'ok'
    })
})

// =============================== fitbit ================================>

router.post("/api/fitbit/webhook", (req, res) => {
    console.log(req.body)
    res.status(204).send()
})

module.exports = router