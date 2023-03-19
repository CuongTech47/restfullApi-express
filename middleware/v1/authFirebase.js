const jwt = require('jsonwebtoken')
const ErrorResponse = require('../../utils/errorResponse')

const Customer = require('../../models/v1/customer.model')


exports.isAuthFirebase = async(req , res , next)=>{
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
        req.customer = await Customer.findById(decodedToken.id)
        console.log(decodedToken)
        next()
    } catch (err) {
        return next(
            new ErrorResponse('Not Authenticated.',401)
        )
    }
}








