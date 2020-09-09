const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require("passport");
exports.userRegister = (req,res,next)=>{
    res.render('register');
}

exports.storeUser = async(req,res,next)=>{
    let {first_name,last_name,email,password,password2} = req.body;
    
    console.log({first_name,last_name,email,password,password2});

    let errors = [];
    if(!first_name || !last_name || !email || !password ||!password2){
        errors.push({message:"Please enter all fields"});
    }

    if(password.length < 6){
        errors.push({message: 'Password should be atleast 6 charecters long'})
    }

    if(password != password2){
        errors.push({message:'Passwords do not match'});
    }

    if(errors.length  > 0){
        res.render('register',{errors,
            first_name,last_name,email});
    }else{
        // FORM VALIDATION PASSED
        let hashedPassword = await bcrypt.hash(password,10);
        let emailIsUnique = await isEmailUnique(email);

        if(emailIsUnique ){
    
            User.create({
                first_name,
                last_name,
                email,
                password:hashedPassword,

            })
            .then(user=>{
                req.flash('message',`User ${user.first_name},
                ${user.last_name} created successfully!`);
                req.flash('status','success');

                res.redirect('/user/login');
            })
        
        }else{
            errors.push({message:'That email is already taken'})
            res.render('register',{errors,
                first_name,last_name,email});
        }
    }
}
exports.userLoginPage = async(req,res,next)=>{
    let msg = req.flash('message').slice();
    let status = req.flash('status').slice();

    res.render('login',{message:msg,status:status});
}

exports.userLogin = (req,res,next)=>{

    console.log('POST REQUEST RECEIVED',req.user);
    res.redirect('/user/dashboard');
}

exports.userDashboard = (req,res,next)=>{
    let first_name;
    if(req.user){
        console.log('THERE IS A REQ.USER!!!')
        first_name = req.user.first_name;
    }else{
        first_name = 'null babe'
    }
    res.render('dashboard',{user:first_name})
}



// helper functions
function isEmailUnique(email){
    return User.count({where:{email:email}})
            .then(count =>  count !=0 ?  false :  true)
            .catch(err=>console.log(err));
}