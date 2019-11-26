const firebase = require("firebase-admin")
const rp = require("request-promise")
const fetchdata = require("./fetchdata")
const fitbitSubscribe = require("./subscribe")
const db = firebase.database()
const client_id = "22DKK3"
const client_secret = "c50cacfa8b8cab58aac60e02c6d0fc16"
const base64 = "MjJES0szOmM1MGNhY2ZhOGI4Y2FiNThhYWM2MGUwMmM2ZDBmYzE2"
const redirect_uri = "https://atria.coach/api/fitbit/auth"
const scope =
  "activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight"
const response_type = "code"
const TokenURL = "https://api.fitbit.com/oauth2/token"
// const redirect_uri = "https://atria.coach/api/fitbit/fetchdata"

const AccessToken = (fitbitCode, firebaseUID) => {
  const requestBody = {
    response_type,
    client_id,
    redirect_uri,
    scope,
    code: fitbitCode,
    grant_type: "authorization_code"
  }
  const requestData = {
    method: "POST",
    headers: {
      Authorization:
        "Basic MjJES0szOmM1MGNhY2ZhOGI4Y2FiNThhYWM2MGUwMmM2ZDBmYzE2"
    },
    uri: TokenURL,
    form: requestBody,
    json: true // Automatically stringifies the body to JSON
  }
  

  return rp(requestData)
    .then(authRes => {
      // fitbitSubscribe.AddSubscriber(firebaseUID, authRes.access_token)
        // .then(subRes => 
          WriteToDb(firebaseUID, authRes)
          // )
        // .catch(err=>console.log("subscribe err: ", err))
    })
   
    .catch(err => {
      console.log(err)
      return err
    })
}

const RefreshToken = (refresh_token, firebaseUID) => {
  const requestBody = {
    refresh_token,
    grant_type: "refresh_token"
  }

  const requestData = {
    method: "POST",
    headers: {
      Authorization:
        "Basic MjJES0szOmM1MGNhY2ZhOGI4Y2FiNThhYWM2MGUwMmM2ZDBmYzE2"
    },
    uri: TokenURL,
    form: requestBody,
    json: true // Automatically stringifies the body to JSON
  }

  return rp(requestData)
    .then(res => {
      fetchdata.fetchData(res.user_id, res.access_token, firebaseUID)
      return WriteToDb(firebaseUID, res)
    })
    .catch(err => {
      return err
    })
}

const WriteToDb = (firebaseUID, authRes = {}, subRes = {}) => {
  return new Promise((resolve, reject) => {
    let user = db.ref("users/" + firebaseUID)
    user.update({
      fitbitAuth: { ...authRes, ...subRes }
    })
    resolve({ fbstatus: 200, data: { ...authRes, ...subRes }})
    reject({ fbstatus: 401, data: "firebase write has failed" })
  })
}

module.exports = { AccessToken, RefreshToken }
