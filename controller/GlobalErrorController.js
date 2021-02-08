const AppError = require('../utils/AppError')

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
  };
  
  const handleDuplicateFieldsDB = err => {
    // const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    console.log(err.keyValue)
    
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//     console.log(value);

    const value = err.keyValue.email
  
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
  };
  const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  };

  const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

    const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);
 

const DevError = (err,res) => {
    console.log(err)
    message = err.message;
    // console.log(message)
    status = err.status || 500;

    return res.status(status).json({
        message,

    })
}

const ProdError = (err,res) => { 
    if(err.isOperational === true){
        message = err.message;
        status = err.status || 500;
    
        return   res.status(status).json({
            message,
    
        })

    }
    else {
        message = 'something went wrong'
        return res.status(500).json({
            message
        })
    }
}

module.exports =(err,req,res,next) => {
    

    if(process.env.NODE_ENV ==='development'){

         DevError(err,res)
    } else if(process.env.NODE_ENV = 'production'){
        console.log(err)
        let error = {...err}
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
          error = handleValidationErrorDB(error);
      
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

       ProdError(error,res)
    }
}