const helpers = {};
const postsModel = require("../models/posts");
const usersModel = require("../models/users");
const cloudinary = require("cloudinary");
const users = require("../models/users");

helpers.verifyNickname = async (nickname)=>{
    try {
        const verify = await usersModel.findOne({nickname:nickname});
        if(verify){
            return true;
        }
        return false;
    } catch (error) {
        console.error(error)
        return "error unexpected"
    }
}

helpers.verifyEmail = async (email)=>{
    try {
        const verify = await usersModel.findOne({email:email});
        if(verify){
            return true;
        }
        return false;
    } catch (error) {
        console.error(error)
        return "error unexpected"
    }
}

helpers.nickname = async (userNickname, nowNickname)=>{
    try {   
        await usersModel.findOneAndUpdate({nickname:userNickname}, {nickname:nowNickname});
        return "updated";
    } catch (error) {
        console.error(error);
        return "error unexpected"
    }
}

helpers.name = async (user, newName)=>{
    try {
        await usersModel.findOneAndUpdate({_id:user}, {name:newName});
        return "updated"
    } catch (error) {
        console.error(error);
        return "error unexpected"
    }
}

helpers.profile_photo = async (file, auth)=>{
    try {
        if(!file){
            return 'file not exist'
        }
        const result = await cloudinary.v2.uploader.upload(
            file.path,
            {public_id:file.filename, folder:('hades/'+auth._id), async:false},
            function(error, result) {console.log(error)}
        );
        
        await usersModel.findOneAndUpdate({_id:auth._id},{profile_Url:result.secure_url});
        return 'updated'
    } catch (error) {
        console.error(error);
        return "error unexpected"
    }
}

helpers.delete_post = async (ID_USER, ROLE_USER, ID_POST)=>{
    try {
        const post = await postsModel.findById(ID_POST);
        if(!post){
            return 'post not found';
        }
        if(String(post.user) == ID_USER ||  ROLE_USER == 'admin'){
            await post.delete();
            await usersModel.findOneAndUpdate({_id:ID_USER}, {$pull:{posts:ID_POST}});
            return 'delete';
        }
        return 'you is not authorized for delete this post'
    } catch (error) {
        console.error(error);
        return "error unexpected"
    }
}

helpers.follow = async (ME_ID, USER_ID)=>{
    try {
        const ME = await usersModel.findById(ME_ID);
        const USER = await usersModel.findById(USER_ID);

        if(!ME || !USER){
            return "user not found";
        }
        const verify = [];
        for (let x = 0; x < USER.followers.length; x++) {
            if(String(USER.followers[x]) == String(ME_ID)){
                verify.push(USER.followers[0]);
            }
        }
        if(verify.length != 0){
            return "you already is follower of this account";
        }
        
        await ME.updateOne({$push: {followerOf:USER_ID}});
        await USER.updateOne({$push: {followers:ME_ID}});

        return "updated";
    } catch (error) {
        console.error(error);
        return "error unexpected"
    }
}

helpers.unfollow = async (ME_ID, USER_ID)=>{
    try {
        const ME = await usersModel.findById(ME_ID);
        const USER = await usersModel.findById(USER_ID);

        if(!ME || !USER){
            return "user not found";
        }
        const verify = [];
        for (let x = 0; x < USER.followers.length; x++) {
            if(String(USER.followers[x]) == String(ME_ID)){
                verify.push(USER.followers[0]);
            }
        }
        if(verify.length == 0){
            return "you isn't follower of this account";
        }

        await ME.updateOne({$pull: {followerOf:USER_ID}});
        await USER.updateOne({$pull: {followers:ME_ID}});

        return "updated";
    } catch (error) {
        console.error(error);
        return "error unexpected"
    }
}

helpers.block = async (ME_ID, USER_ID)=>{
    try {
        const ME = await usersModel.findById(ME_ID);
        const USER = await usersModel.findById(USER_ID);

        if(!ME || !USER){
            return "user not found";
        }
        const verify = [];
        for (let x = 0; x < ME.accountsBlocked.length; x++) {
            if(String(USER.accountsBlocked[x]) == String(USER_ID)){
                verify.push(USER.accountsBlocked[0]);
            }
        }
        if(verify.length != 0){
            return "you already have blocked this account";
        }

        await ME.updateOne({$push: {accountsBlocked:USER_ID}});

        return "updated";
    } catch (error) {
        console.error(error);
        return "error unexpected"
    }
}

helpers.unlock = async (ME_ID, USER_ID)=>{
    try {
        const ME = await usersModel.findById(ME_ID);
        const USER = await usersModel.findById(USER_ID);

        if(!ME || !USER){
            return "user not found";
        }
        const verify = [];
        for (let x = 0; x < ME.accountsBlocked.length; x++) {
            if(String(ME.accountsBlocked[x]) == String(USER_ID)){
                verify.push(ME.accountsBlocked[0]);
            }
        }
        if(verify.length == 0){
            return "you not have blocked this account";
        }

        await ME.updateOne({$pull: {accountsBlocked:USER_ID}});

        return "updated";
    } catch (error) {
        console.error(error);
        return "error unexpected"
    }
}

helpers.modfidyDescription = async (USER_ID, description)=>{
    try {
        await usersModel.findByIdAndUpdate(USER_ID, {description:description});
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = helpers;