
let requireLogin = (req,res,next)=> {
    req.session.returnto = req.url;
    if(!req.session.user_id) {
        res.status(404).send('Please login first');
    } else {
        next();
    }
}

module.exports = requireLogin;