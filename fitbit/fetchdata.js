const firebase = require("firebase-admin")
const serviceAccount = require("../firebase/adminsdk.json")
const rp = require("request-promise")
const auth = require("./auth")

const db = firebase.database()

const fetchData = (fitbitUID, accessToken, firebaseUID, date = null) => {
  if (!date)
    date =
      fullDate.getFullYear() +
      "-" +
      (fullDate.getMonth() + 1) +
      "-" +
      fullDate.getDate()

  const dataURL =
    "https://api.fitbit.com/1/user/" +
    fitbitUID +
    "/activities/date/" +
    date +
    ".json"

  const requestData = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken
    },
    uri: dataURL,
    json: true, // Automatically stringifies the body to JSON
    resolveWithFullResponse: true
  }

  return rp(requestData)
    .then(res => {
      if (res.statusCode === 200)
        return WriteToDb(firebaseUID, date, res.body)
      else
        return res
    })
    .catch(err => {
      return err.response
    })
}

const WriteToDb = (firebaseUID, date, fitbitData = {}) => {
  return new Promise((resolve, reject) => {
    let user = db.ref("users/" + firebaseUID + "/dailyStats/" + date.toString())
    user.update({
      fitbit: fitbitData
    })
    resolve(fitbitData)
  })
}
module.exports = { fetchData }
