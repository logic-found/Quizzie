const catchAsyncError = (theFunc) => {
    return async(req, res, next) => {
        try{
            await theFunc(req, res, next)
        }
        catch(err){
            // wrong mongoDB id error
            if(err.name === "CastError"){
                const message = `Resource not found. Invalid : ${err.path}`
                res.status(400).json({message})
            }
            
            // mongoose duplicate key error
            else if(err.code === 11000){
                const message = `Duplicate ${Object.keys(err.keyValue)} value`
                res.status(400).json({message})
            }
        
            // wrong JWT error
            else if(err.name === "JsonWebTokenError"){
                const message = `Json Web Token is invalid, Try again`
                res.status(400).json({message})
            }
        
            // JWT expire error
            else if(err.name === "TokenExpiredError"){
                const message = `Json Web Token is Expired, Try again`
                res.status(400).json({message})
            }
            else res.status(500).json({message : err.message ||"Internal Server Error"})
        }
    }
}

module.exports = catchAsyncError