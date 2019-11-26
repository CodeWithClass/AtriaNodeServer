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
    .then(res => console.log(res))
    .catch(err => console.log(err))
}


module.exports = { AddSubscriber }
