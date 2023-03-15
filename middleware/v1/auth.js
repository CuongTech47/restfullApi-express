const jwt = require('jsonwebtoken')
const ErrorResponse = require('../../utils/errorResponse')

const User = require('../../models/v1/user.model')


exports.isAuth = async(req , res , next)=>{
    let token 

    if(req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token ){
        return next(new ErrorResponse('Not Authenticated.',401))
    }

    let  decodedToken;

    try {
        decodedToken = jwt.verify(token , process.env.JWT_SECRET)
        req.user = await User.findById(decodedToken.id)
        next()
    } catch (err) {
        return next(
            new ErrorResponse('Not Authenticated.',401)
        )
    }
}


// check user role 

exports.authorize = (...roles) =>{
    return (req , res , next) =>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`,403))
        }
        next()
    }
}





