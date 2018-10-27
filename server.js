var express = require('express'); //import express 
var app = express();
var path = require('path')

app.use(express.static(path.join(__dirname, 'HomePage')));


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
    console.log("HTTP POST Request");
    res.send("HTTP POST Request");
});

app.delete('/', function (req, res) {
    console.log("HTTP DELETE Request");
    res.send("HTTP DELETE Request");
});

//start server on port: 8080
var server = app.listen(8080, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("server listening at port: ", port);
});