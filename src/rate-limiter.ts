import type {RedisClientType} from 'redis' 
import { getFullRedisKey } from './utils/get-full-redis-key.js'



type RateLimiterOptions = {
    windowSizeSecs: number,
    requestLimit: number
    uniqueUserIdentifier: string,
    defaultRedisKeyBase?: string
    
}


/**
 *  This function can be used independently of Expressjs.
 */

//prettier-ignore
export const rateLimiter = async (client: RedisClientType, options: RateLimiterOptions)=>{

        //* Getting a key for Redis with this format: "rate-limit-key:127.0.0.1"
        //* Where both "defaultRedisKeyBase" (default: "rate-limit-key") and "uniqueIdentifier" (default: IP) can be customized
        const key = getFullRedisKey(options.uniqueUserIdentifier, options.defaultRedisKeyBase)
        
        //* Getting current time in milliseconds.
        const now = Date.now()
        
        const windowStart = now - (options.windowSizeSecs * 1000) //% let's  say now: 1000s - 10s = 990s. 
        
        //* Removing all values from 0 to -990s so we are only left with values that are greater from 10s ago to now.
        await client.zRemRangeByScore(key, 0, windowStart)
        
        await client.zAdd(key, [{score: now, value: `req-${Math.random()}`}]) //$ "value" is optional and can be anything unique. It can guarantee more  uniqueness if a multiple requests are made at the same millisecond.
        
        const count = await client.zCard(key)

        //* (optional) completely remove the client key after 10s to prevent memory consumption.
        await client.expire(key, options.windowSizeSecs)
        
        if(count > options.requestLimit) return true; //* If the count is greater than the request limit, return true meaning we there is a rate limit violation.

        return false
}






