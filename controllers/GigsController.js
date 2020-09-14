const Gig = require('../models/Gig');
const Sequilize = require('sequelize');
const User = require('../models/User');
const UserGigs = require('../models/UserGigs');
const Roles = require('../utils/Roles');
const Op = Sequilize.Op;
const Company = require('../models/Company');

const log = console.log;

// @desc    Get all gigs and display view
// @route   GET /gigs
// @access  Public
exports.getAllGigs = async(req,res,next)=>{
    try{
        const gigs = await Gig.findAll( {order: [ [ 'createdAt', 'DESC' ]]});
        let msg = req.flash('message').slice();
        let user,company;
        
        if(req.user){
            user = req.user.role == Roles.USER ? req.user: null;
            company =   req.user.role == Roles.COMPANY ? req.user : null ;
        }
        res.render('gigs',{
            status:'success',
            message: msg,
            gigs:gigs,
            user:user,
            company:company
        })
    }catch(err){
        console.log(err)
    }
};

// @desc Renders new gig form
// @route  GET /gigs/add 
// @acces   Company (in the future)
exports.createNewGig = async (req,res,next)=>{
    let user,company;
    if(req.user){
        user = req.user.role == Roles.USER ? req.user: null;
        company =   req.user.role == Roles.COMPANY ? req.user : null ;
    }
    res.render('add',{user:user,company:company});
}


// @desc Enters  new gig in the DB
// @route  POST /gigs/add 
// @acces   Company (in the future)
exports.storeNewGig = async (req,res,next)=>{
    let user,company;
    if(req.user){
        user = req.user.role == Roles.USER ? req.user: null;
        company =   req.user.role == Roles.COMPANY ? req.user : null ;
    }

    let {title,technologies, budget,description,contact_email} = req.body;
    let errors = [];

    if(!title){
        errors.push({text:'Please add a title'})
    }
    if(!description){
        errors.push({text:'Please add a description'})
    }
    if(!technologies){
        errors.push({text:'Please add a technologies'})
    }
    if(!contact_email){
        errors.push({text:'Please add a contact_email'})
    }
    

    // Check for errors
    if(errors.length > 0 ){
        res.render('add',{
            errors,
            title,
            technologies,
             budget,
             description,
             contact_email,
             user:user,
             company:company
      
        })
    }else{

        if(!budget){
          budget = 'Unknown';
        }
        else{
            budget = `$${budget}`;
        }

        // Make lowercase and remove space after comma
        technologies = technologies.toLowerCase().replace(/, /g, ',')
        // Insert into table
        Gig.create({
            title:title,
            technologies:technologies,
            contact_email,
            description,
            budget,
            title,
            technologies,
            budget,
            description,
            contact_email,
            companyId:req.user.id
        })
        .then(gig=>{
            req.flash('message','You have created a gig successfully!')
            res.redirect('/gigs')
        })
        .catch(err=>console.log(err));
    }
    
}


// @desc Search for gigs by technologies
// @route  GET /gigs/search 
// @acces   Public
exports.searchForGigs = async (req,res,next)=>{
    const term = req.query.term;
    let lowerCaseterm = term.toLowerCase();
    let user,company;
    if(req.user){
        user = req.user.role == Roles.USER ? req.user: null;
        company =   req.user.role == Roles.COMPANY ? req.user : null ;
    }
    Gig.findAll({where:{technologies:{[Op.like]: '%'+ lowerCaseterm +'%'}}})
    .then(gigs=>res.render('gigs',{gigs:gigs,user:user,company:company}))
    .catch(err => console.log(err));

}

// @desc Search for gigs by technologies
// @route  GET /gigs/:id 
// @acces   Public
exports.gigDetails = async (req,res,next)=>{
    const {id} = req.params;
    Gig.findAll({limit:1,
        where:{id:id}})
    .then(gig=>{
        console.table(gig);
        res.render('gig-details',{gig})
    })
    .catch(err => console.log(err));
}

// @desc    Delete Gig
// @route   Post /gigs/delete/:id 
// @acces   Company
exports.destroyGig = async (req,res,next)=>{
    let user,company;
    if(req.user){
        user = req.user.role == Roles.USER ? req.user: null;
        company =   req.user.role == Roles.COMPANY ? req.user : null ;
    }
    const {id} = req.params;
    if(company){
        const owned = await gigOwnedByCompany(company,id);
        if(owned){
            UserGigs.findAll({
                where:{
                    gigId:id
                }
            }).then(results=>{
               results.forEach(result=>{
                   result.destroy();
               })
            })
            .then(()=>{
                Gig.destroy({
                    where:{id:id}
                })
                .then(gig=>{
                    req.flash('message','Gig deleted successfully!')
                    res.redirect('/gigs');
                })
                .catch(err => console.log(err));
            })
            .catch(err=>console.log(err));
        }
    }
    

}


exports.applyingForGig = async (req,res,next)=>{

    const isApplied = await alreadyApplied(req.user.id,req.params.id);

    if(isApplied){
        req.flash('message','You have already applied for this Gig!')
        res.redirect('/gigs');
    }else{
        UserGigs.create({userId:req.user.id,gigId:req.params.id})
        req.flash('message','You have applied successfully!')
        res.redirect('/gigs');
    }
  
}

// Helper Functions
function alreadyApplied(userId,gigId){
  return  UserGigs.count({where:{userId:userId,gigId:gigId}})
    .then(count => count !=0 ?  true :  false )
    .catch(err=>console.log(err));
}

// Check if the Gig is owned by the company
async function gigOwnedByCompany(company,gigId){
    let foundJobs= [];
       try{
            const comp = await Company.findAll({
                where:{id:company.id},
                include:[Gig],
                });
            comp[0].gigs.forEach(gig=>{
                foundJobs.push(gig.get());
            })
         let hasTheJob = foundJobs.filter(x=>x.id==gigId);
         return hasTheJob.length > 0;
       }
       catch(err){
           log(err);
       }
}