// const { model } = require("mongoose");
const CatchAsync = require("../utils/CatchAsync");
const User = require('../model/model').Model
const APIFeatures = require('../utils/ApiFeatures')




exports.Param = (req,res,next,value)=>{
  console.log(`${value}`)
  next()
}

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getOneUser = CatchAsync(async(req,res,next) => {





})

exports.getAllUser = CatchAsync(async(req,res,next) => {
    console.log(req.query)

    try {
        // EXECUTE QUERY
        const features = new APIFeatures(User.find(), req.query)
          .filter()
          .sort()
          .limitFields()
          .paginate();
        const users = await features.query;
        console.log(users)
    
        // SEND RESPONSE
        res.status(200).json({
          status: 'success',
          results: users.length,
          data: {
            users
          }
        });
      } catch (err) {
          console.log(err)
        res.status(404).json({
          status: 'fail',
          message: err
        });
      }
    
    

})

exports.addUser = CatchAsync(async(req,res,next) => {

    const {name,email,password,confirmPassword} = req.body

    const user = new User({
        name,
        email,
        password,
        confirmPassword
    })

    console.log(user.isNew)
    const user1 = await user.save();
    
    console.log(user.isNew)
    console.log(user1.country)
    res.status(201).json({
        user1,
        message:'user created successfully'
    })





})

exports.deleteOneUser = CatchAsync(async(req,res,next) => {
  const {id} = req.params;

  const user = await User.deleteOne()
  res.status(204).json({
    user,
    message:'message deleted successfully'
  })




})

exports.updateOneUser = CatchAsync(async(req,res,next) => {




})


exports.deleteMe = CatchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateMe = CatchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  console.log(filterObj)
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,//return  new updated document
    runValidators: true//run a validator before saving to the database
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
