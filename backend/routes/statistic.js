const express = require('express')
const { createStatistic, getStatistic, updateStatistic } = require('../controllers/statisticController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getStatistic)

router.post('/', createStatistic)

router.patch('/', updateStatistic)

module.exports = router