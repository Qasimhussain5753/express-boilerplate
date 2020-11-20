const router = require('express').Router()
const {
    signin,
    signup,
    logout
} = require('../controller/Auth')
router.route('/login')
    .post(signin)
router.route('/signup')
    .post(signup)
router.route("/logout")
    .post(logout)
module.exports = router