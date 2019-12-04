const firebase = require('firebase-admin')
const db = firebase.database()

const WriteToDb = (firebaseUID, data, key, path = '') => {
  return new Promise((resolve, reject) => {
    let user = db.ref('users/' + firebaseUID + '/' + path)
    user.update({
      [key]: data
    })
    resolve({ fbstatus: 200, body: data })
    reject({ fbstatus: 401, body: 'firebase write has failed' })
  })
}
const ReadFromDb = (firebaseUID, path = '') => {
  let ref = db.ref('users/' + firebaseUID + '/' + path)
  return ref.once('value', snapshot => {
    return snapshot.val()
  })
  //this returns a promise
}

const RemoveFromDb = (firebaseUID, toBeRemoved, path = '') => {
  return new Promise((resolve, reject) => {
    let user = db.ref('users/' + firebaseUID + path)
    user.child(toBeRemoved).remove()

    resolve({ fbstatus: 200, body: `${toBeRemoved} removed` })
    reject({ fbstatus: 401, body: 'firebase removal has failed' })
  })
}

module.exports = { WriteToDb, ReadFromDb, RemoveFromDb }
