const jwt = require("jsonwebtoken");

let validateUser = (req,res,next) => {

    const token = req.header('token');

    if(!token) {
        console.log('please login')
        return res.status(401).send('You have not logged in. Please login first!');
    }

    try {
        let key = jwt.verify(token,"secret");
        req.user = key.id;
        
        next();
    } catch(err) {
        console.log('please check token')
        console.log('secret in validateuser: ',process.env.SECRET)
        return res.status(401).send('Either wrong credentials or internal error');
    }

}

module.exports = validateUser;


