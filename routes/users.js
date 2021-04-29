const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');



router.post('/signup', async (req, res) => {

        User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length >= 1) {
                return res.status(409).json({
                    message: 'A user already exists with this email'
                }) 
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } 
                else {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    });
                    try {
                        user.save()
                        .then(result => {
                            console.log(result)
                            res.status(201).json({
                                message: 'User created successfully'
                            });
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            })
                        })
                    } catch(e) {
                        res.send('Error' + e)
                    }
                        
                }
                
                })
            }
        })
   
})


router.post('/login', (req, res) => {
    User.find({ email: req.body.email })
    .then(user => {
        if(user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                if(result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    })
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })
        }
    })
    .catch()
})

router.delete('/:userId', async (req, res) => {
    User.remove({_id: req.params.userId})
    .then(result => {
        res.status(200).json({
            message: 'User deleted successfully'
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})



module.exports = router