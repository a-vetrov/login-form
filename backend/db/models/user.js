import mongoose from 'mongoose'
const { Schema } = mongoose

export const TokenType = {
  sandbox: 'sandbox',
  real: 'real'
}

const BrokerTokenSchema = new Schema({
  token: String,
  name: String,
  type: String,
  created: Date
})

const userSchema = new Schema({
  authId: String,
  name: String,
  lastName: String,
  email: String,
  password: Buffer,
  salt: String,
  role: String,
  created: Date,
  tokens: [BrokerTokenSchema]
})

export const UserModel = mongoose.model('User', userSchema)

export const getUserByAuthId = async (authId) => UserModel.findOne({ authId })

export const getUserByEmail = async (email) => UserModel.findOne({ email })

export const getUserById = async id => UserModel.findById(id)

export const createUserFromYandexOAuth = async (profile) => {
  const { id, _json: { first_name, last_name, default_email } } = profile
  return await new UserModel({
    authId: id,
    name: first_name,
    lastName: last_name,
    email: default_email,
    role: 'user',
    created: new Date(),
    tokens: []
  }).save()
}

export const updateUserFromYandexOAuth = async (profile) => {
  const { id, _json: { first_name, last_name, default_email } } = profile
  await UserModel.updateOne({ authId: id },
    {
      name: first_name,
      lastName: last_name,
      email: default_email
    })
}
