const express = require('express');

const jwt = require('jsonwebtoken');


var verifyToken = function(req, secretkey, res, next){
    req.token = req.headers['authorization']

    if(req.token === ''){
        res.status(403).send({ status: '403', message: 'no token' })
        return false;
    }
        
    else
        return jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.status(403).send({ status: '403', message: err.message });
                return false
            }
            else {
                res.send(authData)
                return true
            }
        })
    
}

module.exports = {verifyToken: verifyToken}