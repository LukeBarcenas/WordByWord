const Statistic = require('../schema/statisticSchema')

const getStatistic = async (req, res) => {

    const account_id = req.user._id

    const statistic = await Statistic.findOne({ account_id })

    res.status(200).json(statistic)

}

const createStatistic = async (req, res) => {

    const {words_read, average_wpm, fastest_wpm, longest_text, texts_read} = req.body
    
    try {
        
        const account_id = req.user._id
        const statistic = await Statistic.create({words_read, average_wpm, fastest_wpm, longest_text, texts_read, account_id})
        res.status(200).json(statistic)
    
    } catch (error) {
    
        res.status(400).json({error: error.message})
    
    }

}

const updateStatistic = async (req, res) => {

    const account_id = req.user._id

    const statistic = await Statistic.findOneAndUpdate({account_id}, {

        ...req.body

    })

    if(!statistic) {

        return res.status(400).json({error: 'Cannot find statistics!'})

    }

    res.status(200).json(statistic)

}

module.exports = {getStatistic, createStatistic, updateStatistic}