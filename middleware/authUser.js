module.exports = (req,res,next)=>{
    const Roles = require('../utils/Roles');
    if(req.user.role === Roles.USER){
        return next();
    }
    req.flash('message','You have to be logged as User');
    res.redirect('/user/login');
}