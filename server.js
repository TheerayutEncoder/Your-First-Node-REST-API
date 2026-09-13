require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

app.use(express.json())

app.use('/members', require('./routes/members'))
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' })
  }
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

const port = process.env.PORT || 5001
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('Connected to Database')
  app.listen(port, () => console.log(`Server Started on port ${port}`))
}).catch((err) => {
  console.error('Database connection failed:', err.message)
  process.exitCode = 1
})
