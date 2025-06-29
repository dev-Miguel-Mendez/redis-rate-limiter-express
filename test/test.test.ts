import {test, expect, beforeAll, vi} from 'vitest'
import request from 'supertest'
import app, { redisClient, requestLimit } from './setup.js'
import { getFullRedisKey } from '../dist/esm/index.js'


beforeAll(async ()=>{
    await redisClient.FLUSHALL()
})

test('Should set Redis rate-limit key on request', async ()=>{
    //* Default rate limiter config:
    //      requestLimit: 2,
    //      windowSizeSecs: 10

    const now = Date.now()
    const windowSizeSecs = 10
    vi.spyOn(global.Date,  'now').mockReturnValue(now)

    const zAddSpy = vi.spyOn(redisClient, 'zAdd') // Watching for redisClient.zAdd to be called and registering the the call.
    await request(app).get('/')

    // Since this will be ran on NODE_ENV = 'test', the IP will be '1.1.1.1' since that is how it is configured in get-request-ip.ts
    // "rate-limit-key" comes from the default value set in rate-limiter.ts
    const key = getFullRedisKey('1.1.1.1', 'rate-limit-key' )

    expect(zAddSpy).toHaveBeenCalledWith(key, [{score: now, value: `req-${now}`}])

    vi.restoreAllMocks() //! If you don't restore the mocks, the next test will fail because the rate limiter will increment the count.

})


test('Should return 429 status code on rate limit', async ()=>{
    for(let i = 0; i < requestLimit; i++){
        const res = await request(app).get('/')
    }

    const res = await request(app).get('/')
    expect(res.statusCode).toBe(429)
})