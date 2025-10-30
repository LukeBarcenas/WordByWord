const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const accountSchema = new Schema({

    email: {

        type: String,
        required: true,
        unique: true

    },

    password: {

        type: String,
        required: true

    }
})

// Static Signup Method
accountSchema.statics.signup = async function(email, password) {

    if(!email || !password) {

        throw Error('Fields are null!')

    }

    if(!validator.isEmail(email)) {

        throw Error('Email is invalid!')

    }

    if(!validator.isStrongPassword(password)) {

        throw Error('Password is too weak!')

    }

    const emailExists = await this.findOne({email})

    if(emailExists) {

        throw Error('Email already in use!')

    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const account = await this.create({email, password: hash})

    return account

}

accountSchema.statics.login = async function(email, password) {

    if(!email || !password) {

        throw Error('Fields are null!')

    }

    const account = await this.findOne({email})

    if(!account) {

        throw Error('Incorrect Email!')

    }

    const match = await bcrypt.compare(password, account.password)

    if(!match) {

        throw Error('Incorrect Password!')

    }

    return account

}

module.exports = mongoose.model('Account', accountSchema)