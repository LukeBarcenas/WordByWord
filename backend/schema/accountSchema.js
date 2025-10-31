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

        throw Error('Fields cannot be empty!')

    }

    if(!validator.isEmail(email)) {

        throw Error('Email is invalid!')

    }

    if(!validator.isStrongPassword(password,
        {minLength: 5, minLowercase: 1, minUppercase: 1,
            minNumbers: 1, minSymbols: 0  
        }
    )) {

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

        throw Error('Fields cannot be empty!')

    }

    const account = await this.findOne({email})

    if(!account) {

        throw Error('Email not found!')

    }

    const match = await bcrypt.compare(password, account.password)

    if(!match) {

        throw Error('Incorrect Password!')

    }

    return account

}

module.exports = mongoose.model('Account', accountSchema)