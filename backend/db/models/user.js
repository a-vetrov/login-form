import mongoose from 'mongoose'
const { Schema } = mongoose;

const userSchema = new Schema({
  authId: String,
  name: String,
  email: String,
  role: String,
  created: Date,
})

export const UserModel = mongoose.model('User', userSchema)
