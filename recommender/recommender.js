const { ReadFromDb } = require('../helpers/db-helpers')

const getRec = params => {}

const calcRec = async (firebaseUID, date) => {
  const dailyStatsSnapshot = await ReadFromDb({
    firebaseUID,
    path: `dailyStats/${date}`
  })
  const dailyStats = dailyStatsSnapshot.val()
  const myStatsSnapshot = await ReadFromDb({ firebaseUID, path: 'stats' })
  const mystats = myStatsSnapshot.val()

  getRec({ mystats, dailyStats })
  //pass data to ML algo
  //MLalgo(dailyStats)
  return new Promise((resolve, reject) => {
    resolve({ mystats, dailyStats })
    reject('no data')
  })
}

module.exports = { calcRec }
