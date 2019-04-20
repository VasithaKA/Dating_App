const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const ageCalculator = require('../middleware/age-calculator')

require('../models/User');
const User = mongoose.model('users');

//SignUp a User
router.post('/signup', async (req, res) => {
    await User.findOne({ userName: req.body.userName }).exec().then(existingUserName => {
        if (existingUserName) {
            return res.status(409).json({
                message: "User Name already in use. Please enter another one."
            })
        } else {
            bcrypt.hash(req.body.password, 15, function (err, hash) {
                if (err) {
                    return res.status(500).json({
                        message: err
                    })
                } else {
                    const user = new User({
                        userName: req.body.userName,
                        password: hash,
                        createdDate: new Date().toISOString(),
                        lastActive: new Date().toISOString(),
                        gender: req.body.gender,
                        dateOfBirth: req.body.dateOfBirth,
                        knownAs: req.body.knownAs,
                        city: req.body.city,
                        country: req.body.country
                    })
                    user.save().then(result => {
                        res.status(201).json({
                            message: "Your account is created"
                        })
                    }).catch(error => {
                        res.status(500).json({
                            message: error.name
                        })
                    })
                }
            })
        }
    })
})

//Login
router.post('/login', async (req, res, next) => {
    await User.findOne({ userName: req.body.userName }).populate('photos', { url: 1, _id: 0 }, { isMain: true }).exec().then(foundUser => {
        if (!foundUser) {
            return res.status(401).json({
                message: "Auth failed"
            })
        }
        if (foundUser.photos.length === 0) {
            if (foundUser.gender === "male") {
                foundUser.photos[0] = { url: "https://www.bootdey.com/img/Content/avatar/avatar7.png" }
            } else {
                foundUser.photos[0] = { url: "http://www.cocoonbag.com/Content/images/feedback2.png" }
            }
        }
        bcrypt.compare(req.body.password, foundUser.password, function (err, result) {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            if (result) {
                const token = jwt.sign({ userName: foundUser.userName, _id: foundUser._id }, process.env.JWT_KEY, { expiresIn: "1h" })
                return res.status(200).json({
                    message: "Login successful",
                    token: token,
                    mainPhotoUrl: foundUser.photos[0].url
                })
            }
            res.status(401).json({
                message: "Auth failed"
            })
        });
    })
})

//Create Profile
router.patch('/create/:id', checkAuth, async (req, res, next) => {
    await User.findByIdAndUpdate(req.params.id, {
        introduction: req.body.introduction,
        lookingFor: req.body.lookingFor,
        interests: req.body.interests,
        city: req.body.city,
        country: req.body.country
    }).exec().then(() => {
        res.status(201).json({
            message: "Your data has been updated"
        })
    }).catch(error => {
        res.status(500).json({
            message: error.name
        })
    })
})

//Get all user dedails
router.get('/', checkAuth, async (req, res) => {
    await User.find({}, { userName: 1, gender: 1, knownAs: 1, createdDate: 1, city: 1, country: 1 }).populate('photos', { url: 1, _id: 0 }, { isMain: true }).exec((err, result) => {
        if (err) {
            return res.status(500).json({
                message: err.name
            })
        }
        var details = []
        result.forEach(element => {
            if (element._id != req.loggedInUserData._id) {
                if (element.photos[0]) {
                    const object = {
                        _id: element._id,
                        userName: element.userName,
                        gender: element.gender,
                        knownAs: element.knownAs,
                        createdDate: element.createdDate,
                        city: element.city,
                        country: element.country,
                        photoUrl: element.photos[0].url
                    }
                    details.push(object)
                } else {
                    if (element.gender === "male") {
                        photoUrl = "https://www.bootdey.com/img/Content/avatar/avatar7.png"
                    } else {
                        photoUrl = "http://www.cocoonbag.com/Content/images/feedback2.png"
                    }
                    const object = {
                        _id: element._id,
                        userName: element.userName,
                        gender: element.gender,
                        knownAs: element.knownAs,
                        createdDate: element.createdDate,
                        city: element.city,
                        country: element.country,
                        photoUrl: photoUrl
                    }
                    details.push(object)
                }
            }
        })
        res.status(200).json(
            details
        )
    })
})

//Get one user details
router.get('/:id', checkAuth, async (req, res) => {
    await User.findById(req.params.id, { password: 0, __v: 0 }).populate('photos').exec((err, result) => {
        if (err) {
            return res.status(500).json({
                message: err.name
            })
        }
        var photoUrl
        result.photos.forEach(element => {
            if (element.isMain === true) {
                photoUrl = element.url
            }
        });
        if (photoUrl === undefined) {
            if (result.gender === 'male') {
                photoUrl = "https://www.bootdey.com/img/Content/avatar/avatar7.png"
            } else {
                photoUrl = "http://www.cocoonbag.com/Content/images/feedback2.png"
            }
        }
        var age = ageCalculator(result.dateOfBirth, res)
        res.status(200).json({
            result,
            age,
            photoUrl
        })
    })
})

module.exports = router;