const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const roles = require("./roles")

const usersSchema = new Schema({
    nickname:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    postsCount:{
        type:Number,
        default:0
    },
    posts:[{
        type:Schema.Types.ObjectId
    }],
    followers:[{
        type:Schema.Types.ObjectId
    }],
    followerOf:[{
        type:Schema.Types.ObjectId
    }],
    accountsBlocked:[{
        type:Schema.Types.ObjectId,
    }],
    phone:{
        type:String,
    },
    roles: [{
        type: String,
        ref: "roles"
    }],
    profile_Url:{
        type: String,
        default:"https://res.cloudinary.com/dz53t4yrm/image/upload/v1660119125/hades/kisspng-user-profile-computer-icons-user-interface-mystique-5aceb02483a7d5.1624122115234949485393_kmqytm.png"
    },
    description:{
        type: String,
        default: "Hi, i'm new in Hades"
    }
}, {
    timestamps: true
});

usersSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(5);
    return await bcrypt.hash(password, salt);
}

usersSchema.statics.comparePassword = async (encryptPassword, password) => {
    return await bcrypt.compare(password, encryptPassword);
}

module.exports = model("users", usersSchema);