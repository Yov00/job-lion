const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./User');

const Gig = db.define('gig',{
    title:{
        type:Sequelize.STRING,
    },
    technologies:{
        type:Sequelize.STRING,
    },
    description:{
        type:Sequelize.STRING,
    },
    budget:{
        type:Sequelize.STRING,
    },
    contact_email:{
        type:Sequelize.STRING,
    },
    createdAt:{
        type:Sequelize.DATE,
    },
    updatedAt:{
        type:Sequelize.DATE,
    },
  
})

Gig.associate = (models)=>{
    Gig.belongsTo(User)
};
module.exports = Gig;