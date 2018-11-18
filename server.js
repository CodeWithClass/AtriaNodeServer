const express = require('express'); //import express 
const app = express();
var bodyParser = require('body-parser')
const path = require('path')
// const Joi = require('joi')
// const jwt = require('jsonwebtoken')
const getRouter = require('./routes/get.js')
const postRouter = require('./routes/post.js')


app.use(express.static(path.join(__dirname, 'HomePage')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

////// ROUTES /////
app.use(getRouter);
app.use(postRouter);

//start server on port: 8080
var server = app.listen(8080, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("server listening at port: ", port);
});