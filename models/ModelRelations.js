const User = require('./User');
const Gig = require('./Gig');
const UserGigs = require('./UserGigs');

module.exports = ()=>{
    UserGigs.belongsTo(User);
    UserGigs.belongsTo(Gig);

    User.hasMany(UserGigs);
    Gig.hasMany(UserGigs);
}