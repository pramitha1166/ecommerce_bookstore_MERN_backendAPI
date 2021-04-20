const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const User = require('../model/user')
const {errorHandler} = require('../helper/dbErrorHandler')

exports.signin = (req,res) => {
    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                err: "User with tha email does not exist. Please sign up with another email."
            })
        }

        //match user password and create authenticate method in user model
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password dont match"
            });
        }

        //generate web token
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

        //persist the token as 't' in cookie with expire date
        res.cookie("t", token, {expire: new Date() + 9999});

        const {_id, name, email, role} = user;
        return res.json({token, user: { _id, email, name, role}})
    })
}

exports.signup = (req,res) => {
    console.log(req.body);
    const user = new User(req.body)
    user.save((err,user)=> {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        user.salt = undefined
        user.hashed_password = undefined
        res.json({
            user
        })
    })
}

exports.signout =  (req,res) => {
    res.clearCookie("t");
    res.json({message: "Signout success"})
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['sha1', 'RS256', 'HS256'],
    userProperty: "auth"
})

exports.isAuth = (req,res,next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id

    if(!user) {
        return res.status(403).json({
            error: "Access denied"
        })
    }
    next();
}

exports.isAdmin = (req,res,next) => {
    if(req.profile.role===0) {
        return res.status(403).json({
            error: "Admin resource! Access denied"
        })
    }
    next();
}