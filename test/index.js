const { test } = require('tap')
const { redirect } = require('..')

process.env.URL = 'https://example.com'

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
        Location: ['https://example.com/']
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
        Location: ['https://example.com/?x=1']
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
        Location: ['https://example.com/?x=1&x=2']
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
        Location: ['https://example.com/']
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
