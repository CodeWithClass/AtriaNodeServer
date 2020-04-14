const rp = require('request-promise')
const { WriteToDb, ReadFromDb } = require('../helpers/db-helpers')
const { formatDateDetailed, unixToDetailed } = require('../helpers/formating')

const dataURL = 'https://wbsapi.withings.net/measure'

const getBPData = (accesstoken, firebaseUID, date) => {
  const params = {
    action: 'getmeas',
    access_token: accesstoken
  }

  const requestData = {
    method: 'GET',
    uri: dataURL,
    qs: params,
    json: true // Automatically stringifies the body to JSON
  }

  return rp(requestData)
    .then(res => {
      // console.log(res.body || body)
      if (res.status == 401) return res
      else return ProcessData(firebaseUID, date, res.body || res)
    })
    .catch(err => {
      return err.response
    })
}

const ProcessData = (firebaseUID, date, dataObj = {}) => {
  //fix this
  if (!dataObj.measuregrps) return dataObj

  let formattedData = dataObj.measuregrps.map(d => {
    const pid = d.grpid
    const detailedDate = unixToDetailed(d.date)

    let diastolic = d.measures[0] ? d.measures[0].value : 0
    while (diastolic > 300) diastolic /= 10 //manual update adds extra 0s

    let systolic = d.measures[1] ? d.measures[1].value : 0
    while (systolic > 300) systolic /= 10

    let hr = d.measures[2] ? d.measures[2].value : 0
    while (hr > 300) hr /= 10

    if (diastolic === 0 || systolic === 0) return null

    return {
      measurement: {
        pid,
        date: detailedDate,
        diastolic,
        systolic,
        hr
      }
    }
  })

  const filteredData = formattedData.filter(element => element)
  return finalizeData({ firebaseUID, filteredData, date })
}

const finalizeData = async params => {
  const { firebaseUID, filteredData, date } = params
  const path = 'dailyStats/' + date.toString() + '/bp'

  const dataSnapshot = await ReadFromDb({ firebaseUID, path })

  //     let dataFromDb = dataSnapshot.val() || []
  //     let finalData = []

  // dataFromDb.forEach(DBelement => {
  //   filteredData.forEach(withingsElement => {
  //     if (DBelement.measurement.pid === withingsElement.measurement.pid) {
  //       finalData.push(withingsElement)
  //       console.log(true)
  //     } else finalData.push(DBelement)
  //   })
  // })
  // console.log({ finalData })

  // return WriteToDb({
  //   firebaseUID,
  //   data: finalData,
  //   key: 'bp',
  //   path
  // })
}

module.exports = { getBPData }
