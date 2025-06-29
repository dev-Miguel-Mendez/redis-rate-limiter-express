import type {NextFunction, Request, Response} from 'express'
import type {RedisClientType} from 'redis' 
import { RateLimiterOptions } from './types.js'
import { getRequestIp } from './utils/get-request-ip.js'
import { getFullRedisKey } from './utils/get-full-redis-key.js'


export const rateLimiter = (client: RedisClientType, options: RateLimiterOptions)=>{
    return async (req: Request, res: Response, next: NextFunction)=>{
        // Getting IP from request in this format: "127.0.0.1" 
        const ip = getRequestIp(req)
         

        // Getting a key with this format: "rate-limit-key:127.0.0.1"
        // Where "rate-limit-key" can be customized
        const key = getFullRedisKey(ip, options.redisKey)
        
        // Getting current time in milliseconds.
        const now = Date.now()
        
        const windowStart = now - (options.windowSizeSecs * 1000) // let's  say now: 1000s - 10s = 990s. 
        
        // Removing all values from 0 to -990s so we are only left with values that are greater from 10s ago to now.
        await client.zRemRangeByScore(key, 0, windowStart)
        
        await client.zAdd(key, [{score: now, value: `req-${now}`}]) //$ "value" can be anything unique.
        
        const count = await client.zCard(key)

        // (optional) completely remove the client key after 10s to prevent memory consumption.
        await client.expire(key, options.windowSizeSecs)
        
        if(count > options.requestLimit){
            res.status(429).send('Too many requests')
            return
        }else{
            next() //? Do logic with this
        }

    }
}







