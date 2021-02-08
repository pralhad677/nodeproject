const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,'name is required'],
        
    },
    email:{
        type:String,
        required: {
            value: true,
            message: 'email is required'
        },
        unique:true
    },
    photo:String,
    password: {
        type:String,
        required:[true,'password is required'],
        minlength:4,
        maxlength:8
    
    },
    confirmPassword: {
        type:String,
        required:[true,'confirmPassword is required'],
        validate: {
            validator: function (value) {
                return  value === this.password
            },
            message: `confirmPassword is not matched`
        }
    },
    passwordChangedAt: Date,
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    passwordResetToken:String,
    passwordResetExpires:Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }
    
},
{timestamps:true},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)
userSchema.virtual('country').get(function (){
    return 'nepal'
})
userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.confirmPassword = undefined;
    next();
  });

//password reset functionality 16
userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });

userSchema.post('save',async function() {
    console.log('this is pre-save document middleware which runs before saving data to the database')
    // console.log(this.country)
})


userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }; 
  
  userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;//1pm <  2pm true means password is changed 
    }
  
    // False means NOT changed
    return false;
  };
  userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    console.log({ resetToken }, this.passwordResetToken);
  //reset token is only valid for 10 minutes
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };


const Model = mongoose.model('User',userSchema)
const a = new Model({
    name: 'practice',
    email:'practice@gmail.com',
    password:1234567,
    confirmPassword:1234567
})

module.exports = {
    Model,
    a
}