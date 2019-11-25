const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const checkauth = require('./checkauth')


// =============================== Withings ================================>
router.post('/api/withings/auth', (req, res) => {
    console.log(req)
    res.json({
        message: 'ok'
    })
})



module.exports = router