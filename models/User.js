const Sequilize = require('sequelize');
const db = require('../config/database');
const Gig = require('./Gig');
const { Sequelize } = require('sequelize');

const User = db.define('user',{
    first_name:{
        type:Sequilize.STRING,
    },
    last_name:{
        type:Sequilize.STRING,
    },
    email:{
        type:Sequilize.STRING,
        unique:true
    },
    password:{
        type:Sequilize.STRING,
    },
    gigId:{
        type:Sequilize.INTEGER
    },
   
});

User.hasMany(Gig)
module.exports = User;