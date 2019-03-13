'use strict'

const queryString = require('querystring')

exports.redirect = (event, context, callback) => {
  if (!process.env.URL) throw new TypeError('missing process.env.URL')
  const query = event.multiValueQueryStringParameters
    ? '?' + queryString.stringify(event.multiValueQueryStringParameters)
    : ''
  const url =
    process.env.URL +
    event.requestContext.path.replace(
      new RegExp('^/' + event.requestContext.stage),
      ''
    ) +
    query

  const statusCode = +process.env.STATUS_CODE || 302

  callback(null, {
    statusCode,
    multiValueHeaders: {
      Location: [url],
      'Content-Type': ['text/html']
    }
  })
}
