const localStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const bcrypt = require('bcrypt');
const Company = require('./models/Company');
const log = console.log;


module.exports = function initalize(passport){
   
    const authenticateUser = async(email,password,done)=>{
       
        try{
            const user =  await User.findOne({where:{email:email}});
            if(user){
                await bcrypt.compare(password, user.password,(err,isMatch)=>{
                    if(err){
                        throw err
                    }
                    if(isMatch){
                        log('is a match')
                        return done(null,user);
                    }else{
                        return done(null,false,{message:"Password is not correct"})
                    }
                });
            }else{
                return done(null,false,{message:'Email is not registered'});
            }
            
        }catch(err){
          throw err
        }
           
    }
    // For Companies
    const authenticateCompany = async(email,password,done)=>{
       
        try{
            const company =  await Company.findOne({where:{email:email}});
            if(company){
              
                await bcrypt.compare(password, company.password,(err,isMatch)=>{
                    if(err){
                        throw err
                    }
                    if(isMatch){
                        log('is a match Company')
                        return done(null,company);
                    }else{
                        return done(null,false,{message:"Password is not correct"})
                    }
                });
            }else{
                return done(null,false,{message:'Email is not registered'});
            }
            
        }catch(err){
          throw err
        }
           
    }
    passport.use('company',new localStrategy({
        usernameField:'email',
        passwordField:'password'
    },
    authenticateCompany
    ));

    passport.use('user',new localStrategy({
        usernameField:'email',
        passwordField:'password'
    },
    authenticateUser
    ));

    passport.serializeUser((user,done)=>done(null,user));

    passport.deserializeUser(async(user,done)=>{
        try{
            console.log(user);
            if(user.first_name){
                const foundUser = await User.findOne({where:{id:user.id,first_name:user.first_name}})
                return done(null,foundUser);
            }
            else{
                const foundCompany = await Company.findOne({where:{id:user.id,name:user.name}})
                return done(null,foundCompany);
            }
        }
        catch(err){
            throw err;
        }
    })
}