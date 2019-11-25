const rp = require("request-promise")


const AddSubscriber = ( firebaseUID, subscriptionId) => {

  const requestData = {
    method: "POST",
    headers: {},
    uri: "https://api.fitbit.com/1/user/-/apiSubscriptions/"+subscriptionId+".json",
  }

  return rp(requestData)
    .then(res => {return res})
    .catch(err => {
      console.log(err)
      return err
    })
}


module.exports = { AddSubscriber }
