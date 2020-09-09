const Sequelize = require('sequelize');
const {DB_NAME,DB_USER,DB_PASSWORD} = require('./config.json');

module.exports  =  new Sequelize(DB_NAME,DB_USER,DB_PASSWORD,{
    host:'localhost',
    dialect: 'postgres'
})



