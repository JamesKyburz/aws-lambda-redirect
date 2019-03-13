const { test } = require('tap')
const { redirect } = require('..')

process.env.URL = 'https://example.com'

const contentType = { 'Content-Type': ['text/html'] }

test('redirect 302', t => {
  redirect(
    {
      requestContext: {
        path: '/'
      }
    },
    null,
    (err, result) => {
      t.error(err)
      t.equals(result.statusCode, 302)
      t.deepEqual(result.multiValueHeaders, {
        Location: ['https://example.com/'],
        ...contentType
      })
      t.end()
    }
  )
})

test('redirect with querystring', t => {
  redirect(
    {
      requestContext: {
        path: '/'
      },
      multiValueQueryStringParameters: {
        x: ['1']
      }
    },
    null,
    (err, result) => {
      t.error(err)
      t.equals(result.statusCode, 302)
      t.deepEqual(result.multiValueHeaders, {
        Location: ['https://example.com/?x=1'],
        ...contentType
      })
      t.end()
    }
  )
})

test('redirect with multi querystring values', t => {
  redirect(
    {
      requestContext: {
        path: '/'
      },
      multiValueQueryStringParameters: {
        x: ['1', '2']
      }
    },
    null,
    (err, result) => {
      t.error(err)
      t.equals(result.statusCode, 302)
      t.deepEqual(result.multiValueHeaders, {
        Location: ['https://example.com/?x=1&x=2'],
        ...contentType
      })
      t.end()
    }
  )
})

test('request url path with stage removed', t => {
  redirect(
    {
      requestContext: {
        stage: 'dev',
        path: '/dev/test'
      }
    },
    null,
    (err, result) => {
      t.error(err)
      t.equals(result.statusCode, 302)
      t.deepEqual(result.multiValueHeaders, {
        Location: ['https://example.com/test'],
        ...contentType
      })
      t.end()
    }
  )
})

test('redirect 301', t => {
  process.env.STATUS_CODE = 301
  redirect(
    {
      requestContext: {
        path: '/'
      }
    },
    null,
    (err, result) => {
      t.error(err)
      t.equals(result.statusCode, 301)
      t.deepEqual(result.multiValueHeaders, {
        Location: ['https://example.com/'],
        ...contentType
      })
      t.end()
    }
  )
})

test('missing process.env.URL throws error', t => {
  delete process.env.URL
  t.plan(1)
  t.throws(() => {
    redirect(
      {
        requestContext: {
          path: '/'
        }
      },
      null,
      f => f
    )
  })
})
