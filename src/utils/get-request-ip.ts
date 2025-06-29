
import type { Request} from 'express'



export const getRequestIp = (req: Request)=>{

    let unparsedIp
    if(process.env.NODE_ENV == 'test'){ // Offers support for testing, optional
        unparsedIp = '1.1.1.1'
    } else{
        unparsedIp =  (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip) as string;
    }

    
    const ip = unparsedIp?.split('::ffff')[1] || unparsedIp?.split('::')[1] || unparsedIp 
    
    return ip
}
