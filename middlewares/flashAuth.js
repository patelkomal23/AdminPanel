const flashauth = (req,res,next)=>{
    res.locals.message={
        success:req.flash('success')[0],
        error:req.flash('error')[0]
    }
    next();
}

export default flashauth;