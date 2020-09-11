const express =require('express');
const router = express.Router();
const db = require('../config/database');
const passport = require('passport');

const checkAuthenticated = require('../middleware/checkAuthenticated');
const authCompany = require('../middleware/authCompany');
const {
    companyRegisterForm,
    companyRegistration,
    companyLoginPage,
    companyLogin,
    companyDashboard
} = require('../controllers/CompaniesController');

router.route('/register').get(companyRegisterForm);
router.route('/register').post(companyRegistration)
router.route('/login').get(companyLoginPage);
router.route('/login').post(passport.authenticate('company',{
    successRedirect:'/company/dashboard',
    failureRedirect:'/company/login',
    failureFlash:true
}));

router.route('/dashboard').get(checkAuthenticated,authCompany,companyDashboard);
module.exports = router;