const localStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const bcrypt = require('bcrypt');
const log = console.log;
//=========== OLD CODE ============== //

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

    passport.use(new localStrategy({
        usernameField:'email',
        passwordField:'password'
    },
    authenticateUser
    ));

    passport.serializeUser((user,done)=>done(null,user.id));

    passport.deserializeUser(async(id,done)=>{
        try{
            const user = await User.findOne({where:{id:id}})
            return done(null,user);
        }
        catch(err){
            throw err;
        }
    })
}