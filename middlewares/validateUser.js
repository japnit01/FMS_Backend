const jwt = require("jsonwebtoken");

let validateUser = (req,res,next) => {

    const token = req.header('token');

    if(!token) {
        res.status(401).send('Please enter a valid token');
    }

    try {
        let key = jwt.verify(token,"secret");
        req.user = key.id;
        
        next();
    } catch(err) {
        res.status(401).send('Please enter a valid token');
    }

}

module.exports = validateUser;


