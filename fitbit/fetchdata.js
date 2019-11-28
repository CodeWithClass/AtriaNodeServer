const rp = require("request-promise")
const dbHelper = require('../helpers/db-helpers')

const fetchData = (fitbitUID, accessToken, firebaseUID, category, date = null) => {
  if (!date) {
    const fullDate = new Date()
    date =
      fullDate.getFullYear() +
      "-" +
      (fullDate.getMonth() + 1) +
      "-" +
      fullDate.getDate()
  }
  const dataURL =
    `https://api.fitbit.com/1/user/${fitbitUID}/${category}/date/${date}.json`
  
  const requestData = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken
    },
    uri: dataURL,
    json: true, // Automatically stringifies the body to JSON
    resolveWithFullResponse: true
  }

  const firebasePath = `dailyStats/${date}`
  
  return rp(requestData)
    .then(res => {
      if (res.statusCode === 200){
        console.log('doing it', res.statusCode)
        return dbHelper.WriteToDb(firebaseUID, firebasePath, key, res.body)
      }
      else
        return res
    })
    .catch(err => {
      return err.response
    })
}

module.exports = { fetchData }
