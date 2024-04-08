import credentialsDevelopment from '../credentials.development.json' with { type: 'json' }
const env = process.env.NODE_ENV || 'development'

export const credentials = credentialsDevelopment
