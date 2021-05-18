const mongoose = require('mongoose');
 
const UserSchema = mongoose.Schema({
    name: {type:String,required:true},
    email:  { type: String, index: true, unique: true, required: true },
    mobileNumber: Number,
    status:{
        type: String,
        default: 'enabled'
      } ,
    role:String,
    otp:{
        type:String,
        default:null
    },
    password:{
        type:String,
        default:''
    },
    key:String
    
},
{timestamps: true});

module.exports = mongoose.model('User', UserSchema);