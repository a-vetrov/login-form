import mongoose from 'mongoose'
import crypto from 'crypto'
import { UserModel } from './db/models/user.js'
import { credentials } from '../credentials.js'

// const connectionString = 'mongodb://127.0.0.1:27017'
mongoose.connect(credentials.mongo.connectionString)
const db = mongoose.connection
db.on('error', err => {
  console.error('MongoDB error: ' + err.message)
  process.exit(1)
})
db.once('open', () => console.log('MongoDB connection established'))

export const createDefaultUsers = async () => {
  const users = await UserModel.find({})
  if (users.length > 0) {
    console.log('Users already exist. ', users.length)
    return
  }

  const getUserHash = (password) => {
    const salt = crypto.randomBytes(16).toString('hex')
    const key = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    return {
      password: key,
      salt
    }
  }

  void new UserModel({
    authId: '123',
    name: 'gosha',
    email: 'g@b.com',
    ...getUserHash('123'),
    role: 'admin',
    created: new Date(),
    tokens: []
  }).save()

  void new UserModel({
    authId: '123',
    name: 'vetrov',
    ...getUserHash('123'),
    email: 'a@b.com',
    role: 'admin',
    created: new Date(),
    tokens: []
  }).save()
}
