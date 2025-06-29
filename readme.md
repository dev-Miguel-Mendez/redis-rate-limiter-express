# redis-rate-limiter-express

Middleware for Express that implements a sliding‑window rate limiter using Redis sorted sets.

## Installation

```bash
npm install redis-rate-limiter-express
```

## Requirements
You must create and manage your own Redis client instance using the official `redis` package. The client must be connected before being passed to the middleware.

## Usage

```ts

import express from 'express'
import { createClient } from 'redis'
import { rateLimiter } from 'redis-rate-limiter-express'

const app = express()
const redisClient = createClient({ url: process.env.REDIS_URL })
await redisClient.connect()

app.use(
  rateLimiter(redisClient, {
    redisKey: 'rate-limit-key',    // prefix for Redis key
    windowSizeSecs: 10,            // time window in seconds
    requestLimit: 100              // maximum allowed requests per window
  })
)

app.get('/', (req, res) => {
  res.send('OK')
})

app.listen(3000)

```

## Options
`redisKey` (string): Prefix for the Redis sorted set key.

`windowSizeSecs` (number): Duration of the time window in seconds.

`requestLimit` (number): Maximum number of requests allowed during the time window.


## Testing
Test files are not included in the npm package but are available in the GitHub repository.

To run the tests:

```bash
git clone https://github.com/dev-Miguel-Mendez/redis-rate-limiter-express.git
cd redis-rate-limiter-express
npm install
npm test
```