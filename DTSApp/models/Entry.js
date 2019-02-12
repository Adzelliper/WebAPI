var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BugSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    typeOfBug:{
        type:String,
        required:false
    },
    founder:{
        type:String,
        required:true
    },
    priority:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    assignedTo:{
        type:String,
        required:false
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

mongoose.model('Entries', BugSchema);