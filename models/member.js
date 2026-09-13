const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  telephone: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
  },
  memberStartDate: { type: Date, required: true }
})

module.exports = mongoose.model('Member', memberSchema)
