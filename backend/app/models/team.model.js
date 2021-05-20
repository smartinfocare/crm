const mongoose = require('mongoose');
 
const TeamSchema = mongoose.Schema({
    name: {type:String,required:true},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] ,
    teamLeader:{
        type:mongoose.Schema.Types.ObjectId,ref:'User'
    }          
},
{timestamps: true});

module.exports = mongoose.model('Team', TeamSchema);