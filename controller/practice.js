const HosModel = require('../model/practice').Model
const CatchAsync = require("../utils/CatchAsync");

exports.getName = CatchAsync(async(req,res,next) => {

    const data = await HosModel.find();
    res.status(200).json({
            data  
    })

})

exports.add= CatchAsync(async(req,res,next) => {

    // const {name,email,password,confirmPassword} = req.body

    // const user = new User({
    //     name,
    //     email,
    //     password,
    //     confirmPassword
    // })

    // console.log(user.isNew)
    // const user1 = await user.save();

  
    const {name} = req.body
    console.log(name)

    const user = new HosModel({
        name
    })
    console.log('user',user)
    console.log(user.isNew)

    const data = await user.save()
    console.log('data',data)

    res.status(201).json({
        data
    })

    // const user = new User({
    //     name,
    //     email,
    //     password,
    //     confirmPassword
    // })


})