const formatDate = () => {
  const fullDate = new Date()
  const date =
    fullDate.getFullYear() +
    '-' +
    (fullDate.getMonth() + 1) +
    '-' +
    fullDate.getDate()

  return date
}

const formatDateDetailed = () => {
  const fullDate = new Date()
  const date =
    fullDate.getFullYear() +
    '-' +
    (fullDate.getMonth() + 1) +
    '-' +
    fullDate.getDate() +
    ' ' +
    fullDate.getHours() +
    ':' +
    fullDate.getMinutes() +
    ':' +
    fullDate.getSeconds()

  return date
}
module.exports = { formatDate, formatDateDetailed }
