const express = require('express')
const Member = require('../models/member')
const router = express.Router()

// POST and PUT both require the complete set of member details.
function validateBody(req, res, next) {
  const fields = ['name', 'address', 'telephone', 'email', 'memberStartDate']
  if (!req.body || fields.some(field =>
    typeof req.body[field] !== 'string' || !req.body[field].trim())) {
    return res.status(400).json({ message: `Provide non-empty strings for: ${fields.join(', ')}` })
  }
  req.memberData = Object.fromEntries(fields.map(field => [field, req.body[field]]))
  next()
}

async function getMember(req, res, next) {
  if (!/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
    return res.status(400).json({ message: 'Invalid member ID' })
  }
  try {
    res.member = await Member.findById(req.params.id)
    if (!res.member) return res.status(404).json({ message: 'Cannot find member' })
    next()
  } catch (err) {
    next(err)
  }
}

function saveError(err, res, next) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: err.message })
  }
  next(err)
}

router.get('/', async (req, res, next) => {
  try {
    res.json(await Member.find())
  } catch (err) { next(err) }
})

router.get('/:id', getMember, (req, res) => res.json(res.member))

router.post('/', validateBody, async (req, res, next) => {
  try {
    const member = await Member.create(req.memberData)
    res.location(`/members/${member.id}`).status(201).json(member)
  } catch (err) { saveError(err, res, next) }
})

router.put('/:id', getMember, validateBody, async (req, res, next) => {
  try {
    res.member.set(req.memberData)
    res.json(await res.member.save())
  } catch (err) { saveError(err, res, next) }
})

router.delete('/:id', getMember, async (req, res, next) => {
  try {
    await res.member.deleteOne()
    res.json({ message: 'Deleted Member' })
  } catch (err) { next(err) }
})

module.exports = router
