
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { JoplinSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = JoplinSDK.test()
    equal(testsdk instanceof JoplinSDK, true,
      'JoplinSDK.test() must return a client synchronously')
  })

})
