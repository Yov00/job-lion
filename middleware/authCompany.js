module.exports = (req,res,next)=>{
    const Roles = require('../utils/Roles');
    console.log('ROLE: '+req.user.role);
    if(req.user.role === Roles.COMPANY){
        console.log(req.user.role)
        return next();
    }
    res.redirect('/company/login');
}