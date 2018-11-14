const express = require('express'); //import express 
const app = express();
var bodyParser = require('body-parser')
const path = require('path')
const Joi = require('joi')

app.use(express.static(path.join(__dirname, 'HomePage')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//to handle HTTP get request
app.get('/test', function (req, res) {
    // res.sendFile(path.join(__dirname + '/HomePage/index.html'));
    res.send("HTTP get Request");

});

app.put('/', function (req, res) {
    console.log("HTTP Put Request");
    res.send("HTTP PUT Request");
});

app.post('/', function (req, res) {
    console.log(req.body)
    if(req.body)
        res.send(req.body);
    else
        res.send('empty body')
});

app.delete('/', function (req, res) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//start server on port: 8080
var server = app.listen(6969, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("server listening at port: ", port);
});