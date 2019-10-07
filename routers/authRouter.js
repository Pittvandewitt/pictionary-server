const { Router } = require('express');
const { toJWT, toData } = require('../auth/jwt');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const router = new Router()

router.post('/login', (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        res.status(400).send({
            message: 'Please supply a valid email and password'
        })
    } else {
        // 1. find user based on email address
        User.findOne({
            where: {
                email: email
            }
        })
            .then(entity => {
                if (!entity) {
                    res.status(400).send({
                        message: 'User with that email does not exist'
                    })
                }

                // 2. use bcrypt.compareSync to check the password against the stored hash
                else if (bcrypt.compareSync(req.body.password, entity.password)) {

                    // 3. if the password is correct, return a JWT with the userId of the user (user.id)
                    res.send({
                        jwt: toJWT({ userId: entity.id }),
                        userId: entity.id,
                        username: entity.username
                    })
                }
                else {
                    res.status(400).send({
                        message: 'Password was incorrect'
                    })
                }
            })
            .catch(err => {
                console.error(err)
                res.status(500).send({
                    message: 'Something went wrong'
                })
            })
    }
});

router.post('/signup', async (req, res, next) => {
  const email = req.body.email
  const username = req.body.username
  const existingEmail = await User.findOne({ where: { email } })
  const existingUsername = await User.findOne({ where: { username } })
  if (existingEmail) {
    res.status(409).send('Email is already registered')
  }
  else if (existingUsername) {
    response.status(409).send('Username is already taken')
  } else {
    User.create({ ...req.body, password: bcrypt.hashSync(req.body.password, 10) })
      .then(user => {
        if (user) {
          res.status(200).send('User created')
        } else {
          res.send(400).send('Failed to create user')
        }
      })
      .catch(next)
  }
})

module.exports = router