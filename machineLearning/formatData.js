const firebase = require('firebase-admin')
var serviceAccount = require('../firebase/adminsdk.json');
var rp = require('request-promise');

const db = firebase.database();

let formatData = (data) =>{
    let formatedData = new Buffer(data).toString('ascii')
    return formatedData;
}

module.exports = {
    formatData
}