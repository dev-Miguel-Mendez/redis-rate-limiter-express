
/**
 * Getting a key for Redis with this format: "rate-limit-key:127.0.0.1"
 * Where both "defaultRedisKeyBase" (default: "rate-limit-key") and "uniqueIdentifier" (default: IP) can be customized
 * 
 */

export const getFullRedisKey = ( uniqueIdentifier: string, keyBase: string = 'rate-limit-key' )=>{
    const key = `${keyBase}:${uniqueIdentifier}`
    return key
}