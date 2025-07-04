import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  dob: String,
  otp: String,
  otpExpiry: Date,
  password: String,
});

export default mongoose.model('User', userSchema);
