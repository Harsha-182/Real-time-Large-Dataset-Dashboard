/**
 * @description  This file is called an entry file for routes folder.
 */
const router = require('express').Router();
const authRouter = require('./auth');
const taxiRouter = require('./taxiZone');

router.use('/auth', authRouter);
router.use('/taxi', taxiRouter);

module.exports = (app) => app.use(router);
