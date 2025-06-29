
import express from 'express';
import {rateLimiter,} from 'redis-rate-limiter-express'
import {createClient, RedisClientType} from 'redis'
import dotenv from 'dotenv'

dotenv.config({path: './test.env'})


if(!process.env.REDIS_HOST){
    throw new Error('REDIS_HOST must be defined')
}
    
//* Instantiating Redis client and connecting

export const redisClient = createClient({  // Exporting redisClient for mocking
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379')
    }
})
try{
    redisClient.connect()
}catch(e){
    console.log('Could not connect to Redis, print error manually');	
}


export const requestLimit = 2 // Exporting requestLimit for testing

//* Setting up rate limiter
const limiter = rateLimiter(redisClient as RedisClientType, {
    requestLimit,
    windowSizeSecs: 10,
})


//* Instantiating Express app and passing rate limiter
const app = express();
app.use(limiter)

app.get('/', (req, res) => {
    res.send('Hello Test!')
})



export default app
