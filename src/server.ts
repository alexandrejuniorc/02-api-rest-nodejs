import fastify from 'fastify'

const server = fastify()

server.get('/hello', () => {
  return 'hello node'
})

server
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on port')
  })
