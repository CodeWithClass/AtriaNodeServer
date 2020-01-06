const rp = require('request-promise')
const { fetchData } = require('./fetchdata')
const { AddSubscriber } = require('./subscribe')
const { WriteToDb, RemoveFromDb } = require('../helpers/db-helpers')
const client_id = '22DKK3'
const client_secret = 'c50cacfa8b8cab58aac60e02c6d0fc16'
const base64 = 'MjJES0szOmM1MGNhY2ZhOGI4Y2FiNThhYWM2MGUwMmM2ZDBmYzE2'
const redirect_uri = 'https://atria.coach/api/fitbit/auth'
const scope =
  'activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight'
const response_type = 'code'
const getTokenURL = 'https://api.fitbit.com/oauth2/token'
const revokeTokenURL = 'https://api.fitbit.com/oauth2/revoke'

const AccessToken = (fitbitCode, firebaseUID) => {
  const requestBody = {
    response_type,
    client_id,
    redirect_uri,
    scope,
    code: fitbitCode,
    grant_type: 'authorization_code'
  }
  const requestData = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + base64
    },
    uri: getTokenURL,
    form: requestBody,
    json: true // Automatically stringifies the body to JSON
  }

  return rp(requestData)
    .then(authRes => {
      //after accesstoken is received subscribe for updates
      return AddSubscriber(firebaseUID, authRes.access_token)
        .then(subRes => {
          WriteToDb({
            firebaseUID,
            data: true,
            key: 'fitbitAuth',
            path: 'user'
          })

          return WriteToDb({
            firebaseUID,
            data: { ...authRes, ...subRes },
            key: 'fitbitAuth'
          })
        })
        .catch(err => console.log('subscribe err: ', err))
    })

    .catch(err => {
      console.log(err)
      return err
    })
}

const RefreshAndFetch = (firebaseUID, refresh_token, category, date) => {
  const requestBody = {
    refresh_token,
    grant_type: 'refresh_token'
  }

  const requestData = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + base64
    },
    uri: getTokenURL,
    form: requestBody,
    json: true // Automatically stringifies the body to JSON
  }

  return rp(requestData)
    .then(res => {
      WriteToDb({ firebaseUID, data: res, key: 'fitbitAuth' })
      return fetchData(
        res.user_id,
        res.access_token,
        firebaseUID,
        category,
        date
      )
    })
    .catch(err => {
      return err
    })
}

const RevokeToken = (token, firebaseUID) => {
  const requestBody = {
    token
  }
  const requestData = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + base64
    },
    uri: revokeTokenURL,
    form: requestBody,
    json: true // Automatically stringifies the body to JSON
  }

  return rp(requestData)
    .then(() => {
      return RemoveFromDb({ firebaseUID, toBeRemoved: 'fitbitAuth' })
    })
    .catch(err => {
      return err
    })
}

module.exports = { AccessToken, RefreshAndFetch, RevokeToken }
