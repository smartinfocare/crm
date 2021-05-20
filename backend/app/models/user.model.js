const mongoose = require('mongoose');
 
const UserSchema = mongoose.Schema({
    name: {type:String,required:true},
    email:  { type: String, index: true, unique: true, required: true },
    mobileNumber: Number,
    isEnabled:{
        type: Boolean,
        default: true
      } ,
    role:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      },
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