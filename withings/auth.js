const firebase = require('firebase-admin')
var serviceAccount = require('../firebase/adminsdk.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://atria-f4ce1.firebaseio.com'
});

const db = firebase.database();

// ref.once("value", (snapshot) => {
//     console.log(snapshot.val());
// },
//     (errorObject) => {
//         console.log("The read failed: " + errorObject.code);
//     });


const axios = require('axios')
const client_id = '5d81605593c6c4e8e1c3871f69fa3ed026659338266b7e27ba07a352bfb6d7fb'
const client_secret = '5d81605593c6c4e8e1c3871f69fa3ed026659338266b7e27ba07a352bfb6d7fb'
const redirect_uri = "http://atria.coach/api/withings/auth"
const withingsAuthURL = "https://account.withings.com/oauth2_user/authorize2?"
const sc = "D8F9561AAF624FE6B4DA9E0630E4EC01"
const sv = "A106AD714CC84B559CD16A64581CD233"
let AccessObj;

var AccessToken = (withingscode, firebaseUID) =>{
    return axios.post(withingsAuthURL, { 
        params: {
            grant_type: "authorization_code",
            client_id: client_id,
            client_secret: client_secret,
            code: withingscode,
            redirect_uri: redirect_uri,
        }
    })
    .then(res =>{
        return WriteToDb(firebaseUID, res.data)
    })
    .catch(err =>{
        return err
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