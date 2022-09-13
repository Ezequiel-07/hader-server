const { Schema, model } = require("mongoose");

const postsSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true
    },
    nameOfUser:{
        type:String,
        required:true
    },
    profile_Url:{
        type:String,
        required:true
    },
    comment:{
        type:String
    },
    url:{
        type:String,
        required:true,
        unique:true
    },
    public_id:{
        type:String,
        required:true,
        unique:true
    },
    likesId:[{
        type: String,
        default:"62ef51c20e17680879f93ef1"
    }],
    likes:{
        type:Number,
        default:0
    },
    comments:[{
        type: Schema.Types.ObjectId,
        ref: "comments"
    }],
    date:{
        type: Date,
        default: new Date()
    },
    type:{
        type: String,
        required:true 
    }
});

module.exports = model("posts", postsSchema);