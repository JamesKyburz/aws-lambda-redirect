'use strict'

const queryString = require('querystring')

module.exports = (event, callback) => {
  const query = event.queryStringParameters
    ? '?' + queryString.stringify(event.queryStringParameters)
    : ''
  const url =
    process.env.URL +
    event.requestContext.path.replace(
      new RegExp('^/' + event.requestContext.stage),
      ''
    ) +
    query

  const statusCode = process.env.STATUS_CODE || 302

  callback(null, {
    statusCode,
    headers: {
      Location: url
    }
  })
}
