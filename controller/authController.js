const cryptoRandomString  = require('crypto-random-string')
const CatchAsync = require('../utils/CatchAsync')
const User = require('../model/model').Model;
let a = require('../model/model').a
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError')
const sendEmail = require('../utils/email');
// let func = require('../utils/ArrayOfUser')

// exports.signUp =CatchAsync(async(req,res,next) => {
   
//     const random =   cryptoRandomString({length: 32, type: 'base64'});
//     res.json({
//         random
//     })
// })
// let arrayOfUser = []
// console.log(arrayOfUser)

// const x = 3;
global.arrayOfUser = []
// let arrayOfUser = process.env.ARR
const signToken = (id) => {
    // const random =cryptoRandomString({length: 32, type: 'base64'});
    // let data 
    //  [...arrayOfUser,{id,cryptoString : random}]
    // if(statusCode ===200){
      // let arrayOfUser = func('')
  //  let  foundIndex =arrayOfUser.findIndex(x => {
  //       return x.id ===id
  //     })
      // if(foundIndex ===-1){
        // arrayOfUser.push({id,cryptoString : random})
        // func({id,cryptoString : random})

        // console.log(arrayOfUser)  
  
   
      // }
    //  let data = arrayOfUser[foundIndex];


      // arrayOfUser = arrayOfUser.filter(x => {
      //   if(x.id !== id){
      //     return x
      //   }
      //   else {
      //     return {
      //       ...data,
      //       cryptoString : random
      //     }
      //   }
      // })
       
          
      // arrayOfUser.push(data)
      // arrayOfUser[foundIndex] =data
      // console.log(arrayOfUser)  

    // }
    return jwt.sign({ id }, 'gwDJ+YFi87Mfo1Ih8M2qe7Jymbns1+h8' , {
      expiresIn:1000000000000000
    });
  };

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    
    console.log(token)
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    console.log(cookieOptions)
  
    res.cookie('jwt', token, cookieOptions);
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };

exports.signUp = CatchAsync(async (req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    });
    console.log(newUser)
  
    createSendToken(newUser, 201, res);
  });


  //login

  exports.login = CatchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    a=user
    console.log('a',a)
    if (!a || !(await a.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
  
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  });
  
//actually hamile authentication chai user ko grne ho cuz user le kaile ni aru usesr ko list magdena ...eg: user le tour ko datat all magya jhai ho so yo sab user ko list herne kaam admin ko hunxa acutal customer ko hain
  exports.protect = CatchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    // const {id} = req.headers
    // let array1=arrayOfUser ;
    // console.log(id)
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }
  
    
    // console.log('arrayOfUser',arrayOfUser)
    
    // console.log('array1', global.arrayOfUser)
    // const dataId = arrayOfUser.find(x => {
    //   console.log(x.id)
    //   return x.id === id
    // })
    // console.log( global.arrayOfUser.find(x => {
    //   console.log(x.id)
    //   return x.id === id
    // }))
    // if(dataId ===-1){
    //   return 
    // }
    // console.log(x)

    // 2) Verification token
    const decoded =  jwt.verify(token, 'gwDJ+YFi87Mfo1Ih8M2qe7Jymbns1+h8');
  
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }
  // 4) Check if user changed password after the token was issued
  // a=currentUser
  if (currentUser.changedPasswordAfter(decoded.iat)) {//iat =issued at
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
  })


//authorization
  exports.restrictTo = (...arr) => {
    return (req,res,next) => {
        if(!arr.includes(req.user.role)){
        
          return next( new AppError('Your are not authorized to change any resources',403))
        }
        next()
    }
  }
  exports.resetPassword = CatchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
  
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  });

  exports.forgotPassword = CatchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const {email} = req.body
    console.log(email)
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('There is no user with email address.', 404));
    }
    
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
   
    //save is mongoose instance method which runs only when we try to add some data in the data base using a mongoose instance.save() whihc invokes a mongoose documebt middleware where validate runs automatically for save 
    //its do nt validate while data to the data base
    await user.save({ validateBeforeSave: false });
  
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
  
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
        text:`token ${resetToken}`
      });
  
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
  
      // return next(
      //   new AppError('There was an error sending the email. Try again later!'),
      //   500
      // );
      console.log(err)
      return next(new AppError('error occurs while sending email',500))
    }
  });

  exports.updatePassword = CatchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');
  
    // 2) Check if POSTed current password is correct
    a=user
    if (!(await a.correctPassword(req.body.passwordCurrent, a.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }
  
    // 3) If so, update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!
  
    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  });
  