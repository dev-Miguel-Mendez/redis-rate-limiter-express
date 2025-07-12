
export type RateLimiterExpressOptions = {
    requestLimit: number,
    windowSizeSecs: number
    defaultRedisKeyBase?: string
}


export type IsRateLimitedOptions = {
    windowSizeSecs: number,
    requestLimit: number
    uniqueUserIdentifier: string,
    defaultRedisKeyBase?: string
    
}