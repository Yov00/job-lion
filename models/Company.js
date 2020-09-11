const Sequelize = require('sequelize');
const db = require('../config/database');

const Company = db.define('company',{
    name:{
        type:Sequelize.STRING,
    },
    email:{
        type:Sequelize.STRING,
        unique:true
    },
    password:{
        type:Sequelize.STRING
    },
    role:{
        type:Sequelize.STRING
    }
});

module.exports = Company;