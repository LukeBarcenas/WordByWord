const Account = require('../schema/accountSchema')
const jsonwt = require('jsonwebtoken')

const createToken = (_id) => {

    return jsonwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})

}

const loginUser = async (req, res) => {

    const {email, password} = req.body

    try {

        const account = await Account.login(email, password)

        const token = createToken(account._id)

        res.status(200).json({email, token})
    }

    catch (error) {

        res.status(400).json({error: error.message})

    }

}

const signupUser = async (req, res) => {

    const {email, password} = req.body

    try {

        const account = await Account.signup(email, password)

        const token = createToken(account._id)

        res.status(200).json({email, token})
    }

    catch (error) {

        res.status(400).json({error: error.message})

    }
    

}

module.exports = {signupUser, loginUser}