const firebase = require("firebase-admin")
const db = firebase.database()

const WriteToDb = (firebaseUID, path = "", key, data) => {
  console.log('path:', path, 'data',data)
  return new Promise((resolve, reject) => {
    let user = db.ref("users/" + firebaseUID + path)
    user.update({
      [key]: data
    })
    resolve({ fbstatus: 200, data: data })
    reject({ fbstatus: 401, data: "firebase write has failed" })
  })
}

const ReadFromDb = (firebaseUID, path = "") => {
  return new Promise((resolve, reject) => {
    let user = db.ref("users/" + firebaseUID + path)
    const data = user.on("value",  
      (snapshot) => {
        console.log(snapshot.val())
        return (snapshot.val())
      },
      (error) => {
        console.log(error)
        reject({ fbstatus: 401, data: "firebase read has failed" })
      }
    )
    resolve({ fbstatus: 200, data: data })
    reject({ fbstatus: 401, data: "firebase read has failed" })
  })
}

const RemoveFromDb = (firebaseUID, path = "", toBeRemoved) => {
  return new Promise((resolve, reject) => {
    let user = db.ref("users/" + firebaseUID + path)
    user.child(toBeRemoved).remove()

    resolve({ fbstatus: 200, data: `${toBeRemoved} removed`})
    reject({ fbstatus: 401, data: "firebase removal has failed" })
  })
}

module.exports = { WriteToDb, ReadFromDb, RemoveFromDb }
