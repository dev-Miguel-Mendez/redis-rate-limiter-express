import type {NextFunction, Request, Response} from 'express'
import type {RedisClientType} from 'redis' 
import { RateLimiterOptions } from './types.js'
import { getRequestIp } from './utils/get-request-ip.js'
import { rateLimiter } from './rate-limiter.js'

//prettier-ignore
export const rateLimiterExpress = (client: RedisClientType, options: RateLimiterOptions)=>{
    return async (req: Request, res: Response, next: NextFunction)=>{
        
        const uniqueUserIdentifier =
            options.uniqueIdentifier || // If uniqueIdentifier is provided, use it instead of IP.
            getRequestIp(req) // Getting IP from request in this format: "127.0.0.1" 
        
            // Redis, rate limiter logic
        const isRateLimited = await rateLimiter(client, {
            uniqueUserIdentifier,
            windowSizeSecs: options.windowSizeSecs,
            requestLimit: options.requestLimit,
            defaultRedisKeyBase: options.defaultRedisKeyBase
        })
        
        
        if(isRateLimited){
            res.status(429).send('Too many requests')
            return
        }else{
            next() //? Do logic with this
        }

    }
}







