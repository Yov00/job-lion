const express = require('express');
const router = express.Router();
const db = require('../config/database');
const passport = require('passport');

const { route } = require('./gigs');

const {
    userRegister,
    userLogin,
    userLoginPage,
    userDashboard,
    storeUser
} = require('../controllers/UsersController');
const checkAuthenticated = require('../middleware/checkAuthenticated');



router.route('/register').get(userRegister);

router.route('/register').post(storeUser);

router.route('/login').get(userLoginPage);

router.route('/login').post(passport.authenticate('local',{
    successRedirect:'/user/dashboard',
    failureRedirect:'/user/login',
    failureFlash:true
}));

router.route('/dashboard').get(checkAuthenticated,userDashboard);

module.exports = router;