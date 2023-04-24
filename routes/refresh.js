const express = require('express')
router = express.Router()
const refeshTokenController = require('../controllers/refreshToken')

router.get('/', refeshTokenController.handleRefreshToken)

module.exports = router