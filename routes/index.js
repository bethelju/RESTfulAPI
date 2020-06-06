const router = module.exports = require('express').Router();

router.use('/lodgings', require('./lodgingRoutes'));
router.use('/guests', require('./guestsRoutes'));
router.use('/login', require('./loginRoutes'))