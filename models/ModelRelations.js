const User = require('./User');
const Gig = require('./Gig');
const UserGigs = require('./UserGigs');
const Company = require('./Company');

module.exports = ()=>{
    UserGigs.belongsTo(User);
    UserGigs.belongsTo(Gig);

    User.hasMany(UserGigs);
    Gig.hasMany(UserGigs);

    Company.hasMany(Gig);
    Gig.belongsTo(Company);
}