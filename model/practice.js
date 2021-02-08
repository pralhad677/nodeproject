const mongoose = require('mongoose')
const User = require('./model').Model

const hospitalSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'HospitalName is required']

    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: [true, 'Review must belong to a user']
      }],
    //   guides: [
    //     {
    //       type: mongoose.Schema.ObjectId,
    //       ref: 'User'
    //     }
    //   ]
})

// hospitalSchema.pre('save')
hospitalSchema.pre('save',async function(next) {
    console.log('i am running')
    const data = await User.find({}).select('+ _id')
    console.log('data',data)
    console.log(this.user)
    this.user = this.user.push(data[0].id)
    console.log('this.user',this.user[0])
        let populateData= await User.findById(this.user[0]).populate({
            path:'user',
            select:'-__v -passwordResetExpires -passwordResetToken -updatedAt -createdAt -password'

        })
        console.log(populateData)
    next()
})

const Model = mongoose.model('Hospital',hospitalSchema)

module.exports = {
    Model
}
