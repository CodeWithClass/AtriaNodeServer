const rp = require("request-promise")


const AddSubscriber = subscriptionId => {

  const requestData = {
    method: "POST",
    headers: {},
    uri: "https://api.fitbit.com/1/user/-/apiSubscriptions/"+subscriptionId+".json",
  }

   rp(requestData)
    .then(res => { console.log(res)})
    .catch(err => {
      console.log(err)
      return err
    })
}


module.exports = { AddSubscriber }