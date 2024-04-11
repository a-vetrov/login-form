import RedisStore from 'connect-redis'
import { createClient } from 'redis'
import { credentials } from '../../credentials.js'

// Initialize client.
const redisClient = createClient({ url: credentials.redis.connectionString })
redisClient.connect().catch(console.error)

// Initialize store.
export const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'vizify:'
})
