import mongoose from 'mongoose'
const { Schema } = mongoose;

const BrokerTokenSchema = new Schema({
  token: String,
  name: String,
  created: Date,
})


const userSchema = new Schema({
  authId: String,
  name: String,
  email: String,
  password: Buffer,
  salt: String,
  role: String,
  created: Date,
  tokens: [BrokerTokenSchema]
})

export const UserModel = mongoose.model('User', userSchema)

export const getUserByEmail = async (email) => UserModel.findOne({ email })
export const getUserById = async id => UserModel.findById(id)
