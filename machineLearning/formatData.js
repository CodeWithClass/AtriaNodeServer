const formatMLData = data => {
  const formatedData = new Buffer(data).toString('ascii')
  return formatedData
}

module.exports = { formatMLData }
