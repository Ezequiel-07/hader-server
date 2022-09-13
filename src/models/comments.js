const { Schema, model } = require("mongoose");

const commentsSchema = new Schema({
    nickname:{
        type: String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
}, {versionkey: false});

module.exports = model("comments", commentsSchema);