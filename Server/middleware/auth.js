const jwt = require('jsonwebtoken')
const User = require('../schema/User')


const auth = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    if(!token){
        res.status(401).json({message : "Please login to access this resource"})
    }
    else{
        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(id)
        if(user){
            req.user = user
            next()
        }
        else {
            res.status(401).json({message : "Please login to access this resource"}) 
        }
    }
}

module.exports = auth