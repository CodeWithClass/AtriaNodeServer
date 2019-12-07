const rp = require('request-promise')
const { WriteToDb } = require('../helpers/db-helpers')
const { formatDate } = require('../helpers/formating')

const fetchData = (
  fitbitUID,
  accessToken,
  firebaseUID,
  category,
  date = null
) => {
  date = formatDate()
  const dataURL = `https://api.fitbit.com/1/user/${fitbitUID}/${category}/date/${date}.json`

  const requestData = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    uri: dataURL,
    json: true, // Automatically stringifies the body to JSON
    resolveWithFullResponse: true
  }

  const firebasePath = `dailyStats/${date}`

  return rp(requestData)
    .then(res => {
      if (res.statusCode === 200)
        return WriteToDb(firebaseUID, res.body, category, firebasePath)
      else return res
    })
    .catch(err => {
      return err.response
    })
}

module.exports = { fetchData }
