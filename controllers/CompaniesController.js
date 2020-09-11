const Gig = require('../models/Gig');
const Sequilize = require('sequelize');
const bcrypt = require('bcrypt');
const Company = require('../models/Company');
const Roles = require('../utils/Roles');
const log = console.log;

exports.companyRegisterForm = (req,res,next) =>{
    res.render('register-company');
}

exports.companyRegistration = async (req,res,next)=>{
    const {company_name,password,password2,company_email} = req.body;

    let errors = [];
    if(!company_name || !company_email){
        errors.push({message:'All the fields should be filled!'});
    }
    if(password.length < 6){
        errors.push({message:'Password should be atleast 6 charecters long'});
    }
    if(password != password2){
        errors.push({message:"Passwords don't match"});
    }
    else{
        // Form Validation Passed
        let hashedPassword = await bcrypt.hash(password,10);
        let emailIsUnique = await isEmailUnique(company_email);

        if(emailIsUnique){
          
            Company.create({
                name:company_name,
                email:company_email,
                password:hashedPassword,
                role:Roles.COMPANY
            })
            .then(company=>{
                req.flash('message',`Company ${company_name} created successfully!`);
                res.redirect('/company/login');
            })
            .catch(err=>console.log(err));
        }else{
            errors.push({message:'The provided email is already in use'});
            
            res.render('register-company',{errors,
            company_name,company_email})
        }
    }
    
}

exports.companyLoginPage =  (req,res,next)=>{
    res.render('login-company');
}

exports.companyLogin = async(req,res,next)=>{
    res.redirect('/company/dashboard')
}

exports.companyDashboard = (req,res,next)=>{
    console.log(req.isAuthenticated())
    res.render('company-dashboard');
}
// Helper Functions
async function isEmailUnique(email){
    return Company.count({where:{email:email}})
                .then(count=> count > 0 ? false : true)
                .catch(err=>console.log(err));
}