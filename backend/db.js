import mongoose from 'mongoose'
import {UserModel} from "./db/models/user.js";

const connectionString = 'mongodb://127.0.0.1:27017'
mongoose.connect(connectionString)
const db = mongoose.connection
db.on('error', err => {
  console.error('MongoDB error: ' + err.message)
  process.exit(1)
})
db.once('open', () => console.log('MongoDB connection established'))


export const startDB = () => {
  console.log('DB started')
}

export const createDefaultUsers = async () => {
  const users = await UserModel.find({})
  if (users.length > 0) {
    console.log('Users already exist. ', users.length)
    return
  }

  void new UserModel({
    authId: '123',
    name: 'gosha',
    email: 'a@b.com',
    role: 'admin',
    created: new Date(),
  }).save()

  void new UserModel({
    authId: '123',
    name: 'vetrov',
    email: 'a@b.com',
    role: 'admin',
    created: new Date(),
  }).save()

}
