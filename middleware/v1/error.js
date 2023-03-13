const errorHandler = (err , req , res , next)=>{
    const status = err.statusCode || 500
    const message = err.message
        res.status(status).json({
            success : false,
            message : message || `Server Error`
        })
}


module.exports = errorHandler