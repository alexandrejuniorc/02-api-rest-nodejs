import { server } from './app'
import { env } from './env'

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running on port')
  })
