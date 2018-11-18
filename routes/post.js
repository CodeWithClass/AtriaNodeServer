const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const checkauth = require('./checkauth')

router.post('/api/login', (req, res) => {
    //mocker user
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com'
    }

    jwt.sign({ user }, 'secretkey', (err, token) => {
        res.json({
            token,
            hi: 'jsdsd'
        })
    });

})
// console.log(checkauth.verifyToken)

router.post('/api/post', (req, res) => {

    const routeAuth = () => checkauth.verifyToken(req, 'secretkey', res);

    if(routeAuth()){
        ///do stuff
    }else{
        //unable to do stuff
    }
    
})




module.exports = router