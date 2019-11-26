const rp = require("request-promise")


const AddSubscriber = (subscriptionId, accessToken) => {

  const requestData = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken
    },
    uri: "https://api.fitbit.com/1/user/-/apiSubscriptions/"+subscriptionId+".json",
  }

   return rp(requestData)
    .then(res => { return res })
    .catch(err => console.log("subErr", err))
}


module.exports = { AddSubscriber }
