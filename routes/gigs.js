const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const checkAuthenticated = require('../middleware/checkAuthenticated');

const { 
    getAllGigs,
    createNewGig,
    storeNewGig,
    searchForGigs,
    gigDetails,
    destroyGig,
    applyingForGig
}  = require('../controllers/GigsController');
const authUser = require('../middleware/authUser');
const authCompany = require('../middleware/authCompany');

// Get gig list
router.route('/').get(getAllGigs);

// Display new gig form
router.route('/add').get(createNewGig)

// Add new gig
router.route('/add').post(storeNewGig)

// Search for gigs
router.route('/search').get(searchForGigs);

// Search for gigs
router.route('/:id').get(gigDetails);

// Delete gig
router.route('/delete/:id').post(checkAuthenticated,authCompany,destroyGig);

// Delete gig
router.route('/apply/:id').get(checkAuthenticated,authUser,applyingForGig);
module.exports = router;