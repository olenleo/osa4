const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.post('/', async (request, response, next) => {
    const body = request.body
    const saltRounds = 10
    if (!body.password) {
      return response
      .status(400)
      .json({ error : "no password" })
    }
    if (body.password.length < 3) {
      return response
      .status(400)
      .json({ error : "password length less than minimum (3)" })
    }
    
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })
    
    try {
      const savedUser = await user.save();
      response.json(savedUser);
    } catch (exception) {
      next(exception);
    }
})


usersRouter.get('/', async (request,response) => {
  const users = await User.find({})
  response.json(users.map(user => user.toJSON))

})

module.exports = usersRouter