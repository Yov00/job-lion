module.exports = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('message','You must be logged in');
    res.redirect('/user/login');
}