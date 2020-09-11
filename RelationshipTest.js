const User = require('./models/User');
const Gig = require('./models/Gig');
const UserGigs = require('./models/UserGigs');
const relations = require('./models/ModelRelations');
const Roles = require('./utils/Roles');
const Company = require('./models/Company');
relations();

const comp = {
    name:'Tesla Motors',
    password:'213n12[]123[12][3e12][23]',
    email:'tesla_motors@tesla.com'
}

// Company.create(comp)
// .then(res=>console.log(res.get()))
// .catch(err=>console.log(err))

// Gig.findAll({
//     include:[Company]
// })
// .then(result=> {
//     result.forEach(res =>{
//         console.log(res.company.get())
//     })
// })
// .catch(err=>console.log(err));

// User.findAll().then(users=>{
//     const yovelin = users[0];
//     Gig.findAll()
//     .then(gigs=>{
//       const fullStack = gigs[0];
//         UserGigs.create({userId:yovelin.id,gigId:fullStack.id})
//     })
// })
// .catch(e=>console.log(e));


// User.findAll({include:[{
//     model:UserGigs,
//     include:[Gig]
// }]})
// .then(users=>{
//     users.forEach(u =>{
//         console.log(u.user_gigs.forEach(gig=>console.log(gig)));
//     })
// })
// .catch(err=>console.log(err));

// Company.findAll()
// .then(companies=>{
//     companies.forEach(c=>console.log(c.get()))
// })

console.log(Roles.COMPANY);