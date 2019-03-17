const firebase = require('firebase-admin')
const rp = require('request-promise');

const db = firebase.database();
const client_id = '22DKK3'
const client_secret = 'c50cacfa8b8cab58aac60e02c6d0fc16'
const redirect_uri = 'https%3A%2F%2Fatria.coach%2Fapi%2Ffitbit%2Fauth'
const scope = 'activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight'
const expires_in = '604800'
const response_type = 'code'
const TokenURL = "https://www.fitbit.com/oauth2/authorize?"


const AccessToken = (fitbitCode, firebaseUID) => {
    const requestBody = {
        response_type,
        client_id,
        redirect_uri,
        scope,
        code: fitbitCode,
    }

    const requestData = {
        method: 'POST',
        uri: TokenURL,
        form: requestBody,
        json: true // Automatically stringifies the body to JSON
    };

    return rp(requestData)
        .then((resBody) => {
            return WriteToDb(firebaseUID, resBody)
        })
        .catch((err) => {
            return console.log(err)
        });
}


const RefreshToken = (refresh_token, firebaseUID) => {
    const requestBody = {
        client_id,
        client_secret,
        refresh_token,
        grant_type: "refresh_token",
    }

    const requestData = {
        method: 'POST',
        uri: TokenURL,
        form: requestBody,
        json: true // Automatically stringifies the body to JSON
    };

    return rp(requestData)
        .then((res) => {
            return WriteToDb(firebaseUID, res)
        })
        .catch((err) => {
            return err.response
        });
}


const WriteToDb = (firebaseUID, AuthObj) => {
    return new Promise((resolve, reject) => {
        let user = db.ref('users/' + firebaseUID)
        user.update({
            fitbitAuth: AuthObj
        })
        resolve(
            {
                fbstatus: 200,
                data: AuthObj
            }
        )
    }
    )

}

module.exports = { AccessToken, RefreshToken }
