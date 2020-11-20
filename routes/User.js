const router = require('express').Router()
const {
    getUser,
} = require('../controller/User')

router.route('/:id')
    .get(getUser)

module.exports = router