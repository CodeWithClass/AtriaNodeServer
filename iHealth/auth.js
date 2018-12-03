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
const client_id = '477d71a15cb74d14aec1d661cdc92e81'
const client_secret = 'f4a0b5d7986843529cc0f4c3f614c3d5'
const redirect_uri = "http://atria.coach/api/ihealth/auth_inprogress"
const iHealthAuthURL = "https://api.ihealthlabs.com:8443/OpenApiV2/OAuthv2/userauthorization/?"
const sc = "D8F9561AAF624FE6B4DA9E0630E4EC01"
const sv = "A106AD714CC84B559CD16A64581CD233"
let AccessObj;

var AccessToken = (ihealthcode, firebaseUID) =>{
    return axios.get(iHealthAuthURL, { 
        params: {
            client_id: client_id,
            client_secret: client_secret,
            grant_type: "authorization_code",
            redirect_uri: redirect_uri,
            code: ihealthcode,
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
            iHealthAuth: AuthObj
            })
        resolve("success") 
        }
    )


}
module.exports = { AccessToken: AccessToken }