const firebase = require('firebase-admin')
var serviceAccount = require('../firebase/adminsdk.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://atria-f4ce1.firebaseio.com'
});

const db = firebase.database();

const axios = require('axios')
const client_id = '5d81605593c6c4e8e1c3871f69fa3ed026659338266b7e27ba07a352bfb6d7fb'
const client_secret = '2798f13818cc213ccce23a4c7c6e0e107a2156ff9aeffb275bc8e9eccde4dd63'
const redirect_uri = "http://atria.coach/api/withings/auth"
const withingsAuthURL = "https://account.withings.com/oauth2/token"
let AccessObj;


var AccessToken = (withingscode, firebaseUID) =>{
    const requestBody = {
        client_id,
        client_secret,
        redirect_uri,
        code: withingscode,
        grant_type: "authorization_code",
    }

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    console.log(requestBody)

    return axios.post(withingsAuthURL, requestBody, config)
    .then(res =>{
        return WriteToDb(firebaseUID, res.data)
    })
    .catch(err =>{
        // return err
        console.log(err)
        return
    })
}

var WriteToDb = (firebaseUID, AuthObj) =>{
    return new Promise ((resolve, reject) => { 
        let user = db.ref('users/'+firebaseUID)        
        user.update({
            withingsAuth: AuthObj
            })
        resolve("success") 
        }
    )


}
module.exports = { AccessToken: AccessToken }