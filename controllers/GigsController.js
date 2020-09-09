const Gig = require('../models/Gig');
const Sequilize = require('sequelize');
const User = require('../models/User');
const Op = Sequilize.Op;

const log = console.log;

// @desc    Get all gigs and display view
// @route   GET /gigs
// @access  Public
exports.getAllGigs = async(req,res,next)=>{
    try{
        const gigs = await Gig.findAll( {order: [ [ 'createdAt', 'DESC' ]]});
        let msg = req.flash('message').slice();

        res.render('gigs',{
            status:'success',
            message: msg,
            gigs:gigs,
        })
    }catch(err){
        console.log(err)
    }
};

// @desc Renders new gig form
// @route  GET /gigs/add 
// @acces   Company (in the future)
exports.createNewGig = async (req,res,next)=>{
    res.render('add');
}


// @desc Enters  new gig in the DB
// @route  POST /gigs/add 
// @acces   Company (in the future)
exports.storeNewGig = async (req,res,next)=>{
    
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
             contact_email
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
            contact_email
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
    const {term} = req.query;
    let lowerCaseterm = term.toLowerCase();

    Gig.findAll({where:{technologies:{[Op.like]: '%'+ lowerCaseterm +'%'}}})
    .then(gigs=>res.render('gigs',{gigs}))
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

    const {id} = req.params;

    Gig.destroy({
        where:{id:id}
    })
    .then(gig=>{
        const message = `${gig.title} has been destroyed`;
        req.flash('message','Gig deleted successfully!')
        res.redirect('/gigs');
    })
    .catch(err => console.log(err));
}


exports.applyingForGig = async (req,res,next)=>{
    // console.log(req.user.email);
    // log(req.params.id)
    try{
        let user = await User.findOne({where:{id:req.user.id}});
        let gig = await Gig.findOne({where:{id:req.params.id}})
        gig.update({userId:user.id})
            .then((gig)=>{

            })

        user.update({
            gigId:gig.id
        }).then(async (user)=>{
            let b = await User.findAll({include:[{model:Gig}]})
           
            log(b.gig)
        })
    }catch(err){
        log(err)
    }
}