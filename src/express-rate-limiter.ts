import type {NextFunction, Request, Response} from 'express'
import type {RedisClientType} from 'redis' 
import { RateLimiterExpressOptions } from './types.js'
import { getRequestIp } from './utils/get-request-ip.js'
import { isRateLimited } from './rate-limiter.js'


/**
 *  Rate limiter middleware for Expressjs
 */

//prettier-ignore

export const rateLimiterExpress = (client: RedisClientType, options: RateLimiterExpressOptions)=>{
    return async (req: Request, res: Response, next: NextFunction)=>{
        
        const uniqueUserIdentifier = getRequestIp(req) //* Getting IP from request in this format: "127.0.0.1" 
        
            //* Redis, rate limiter logic. Can also be used independently.
        const isLimited = await isRateLimited(client, {
            uniqueUserIdentifier,
            windowSizeSecs: options.windowSizeSecs,
            requestLimit: options.requestLimit,
            defaultRedisKeyBase: options.defaultRedisKeyBase
        })
        
        
        if(isLimited){
            res.status(429).send('Too many requests')
            return
        }else{
            next() //? Do logic with this
        }

    }
}







