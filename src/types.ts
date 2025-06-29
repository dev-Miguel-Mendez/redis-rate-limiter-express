


export type RateLimiterOptions = {
    requestLimit: number,
    windowSizeSecs: number
    redisKey?: string 
}