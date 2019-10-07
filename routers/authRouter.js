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

module.exports = router