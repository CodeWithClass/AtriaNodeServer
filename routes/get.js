const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken')
const axios = require('axios');


router.get('/api/get', (req, res) => {
    res.json({
        message: "welcome to get in anodda fileee"
    })
});

router.get('/api/ihealth/auth_inprogress', (req, res) => {
    // console.log(req.url)
    let reqURL = decodeURI(req.url)
    let code = reqURL.split('code=')[1]
    axios.get('https://api.ihealthlabs.com:8443/OpenApiV2/OAuthv2/userauthorization/?client_id=477d71a15cb74d14aec1d661cdc92e81&client_secret=f4a0b5d7986843529cc0f4c3f614c3d5&grant_type=authorization_code&redirect_uri=' + encodeURI('http://atria.coach/api/ihealth/auth_finished/') + '&code=' + code)
        .then(response => {
            console.log(response.data)
            resdata = response.data
            response.writeHead(200, {
                'Location': 'http://atria.coach/api/ihealth/auth_finished/' + 'AccessToken=' + resdata.AccessToken
                    + 'UID=' + resdata.UserID
            })
        })
        .catch(error => {
            console.log(error);
        });

    // res.json({
    //     message: "welcome to ihealth getting everything ready for ya",
    //     reqURL: authcode
    // })
    res.end();
});

router.get('/api/ihealth/auth_finished')

router.get('/api/ihealth_remove', (req, res) => {
    res.json({
        message: "sucessfully removed Atria's authorization"
    })
});

module.exports = router