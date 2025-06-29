export const getFullRedisKey = ( ip: string, baseKey?: string,)=>{
    let key = baseKey || 'rate-limit-key' 
    key = `${key}:${ip}`

    return key
}