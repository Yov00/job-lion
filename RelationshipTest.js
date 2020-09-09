const User = require('./models/User');
const Gig = require('./models/Gig');
const UserGigs = require('./models/UserGigs');
const relations = require('./models/ModelRelations');

// User.findAll().then(users=>{
//     const yovelin = users[0];
//     Gig.findAll()
//     .then(gigs=>{
//       const fullStack = gigs[0];
//         UserGigs.create({userId:yovelin.id,gigId:fullStack.id})
//     })
// })
// .catch(e=>console.log(e));


User.findAll({include:[{
    model:UserGigs,
    include:[Gig]
}]})
.then(users=>{
    users.forEach(u =>{
        console.log(u.user_gigs.forEach(gig=>console.log(gig)));
    })
})
.catch(err=>console.log(err));