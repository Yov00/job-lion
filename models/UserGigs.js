const Sequelize = require('sequelize');
const db = require('../config/database');
const Gig = require('./Gig');
const User = require('./User');

const UserGigs = db.define('user_gigs',{

});


module.exports = UserGigs;