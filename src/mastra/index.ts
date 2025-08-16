import { Mastra } from '@mastra/core/mastra'

const ENV = process.env.NODE_ENV || 'development'

export const mastra = new Mastra({
  // ...
  server: {
    // Disable CORS for development
    cors:
      ENV === 'development'
        ? {
            origin: '*',
            allowMethods: ['*'],
            allowHeaders: ['*'],
          }
        : undefined,
  },
})
