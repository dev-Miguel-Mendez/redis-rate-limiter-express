
export type RateLimiterOptions = {
    requestLimit: number,
    windowSizeSecs: number
    defaultRedisKeyBase?: string
    uniqueIdentifier?: string
}