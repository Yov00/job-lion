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
    storeUser,
    userLogout
} = require('../controllers/UsersController');

const checkAuthenticated = require('../middleware/checkAuthenticated');
const authUser = require('../middleware/authUser');


router.route('/register').get(userRegister);

router.route('/register').post(storeUser);

router.route('/login').get(userLoginPage);

router.route('/login').post(passport.authenticate('user',{
    successRedirect:'/user/dashboard',
    failureRedirect:'/user/login',
    failureFlash:true
}));
router.route('/dashboard').get(authUser,checkAuthenticated,userDashboard);
router.route('/logout').get(userLogout);

module.exports = router;