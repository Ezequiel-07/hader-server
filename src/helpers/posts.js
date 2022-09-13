const helpers = {};
const postsModel = require("../models/posts");
const usersModel = require("../models/users");
const commentModel = require("../models/comments");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");

helpers.publish = async (file, auth, comment)=>{
    try {
        const result = await cloudinary.v2.uploader.upload(
            file.path,
            {
                public_id:file.filename, 
                folder:('hades/'+auth.nickname), 
                async:false, 
                eager: [
                    { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
                    { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } 
                ],                                   
                eager_async: true 
            },
            function(error, result) {console.log(error)}
        );
    
        const newPost = new postsModel({
            user:auth._id,
            nameOfUser:auth.nickname,
            profile_Url:auth.profile_Url,
            comment:comment,
            url:result.secure_url,
            public_id:result.public_id,
            type:'img'
        });
    
        fs.unlink(file.path);
        await newPost.save();
    
        await usersModel.findOneAndUpdate({nickname:auth.nickname}, {$push:{posts:newPost._id}});
    } catch (error) {
        console.error(error);
    }
}

helpers.publishVideo = async (file, auth, comment)=>{
    try {
        const result = await cloudinary.v2.uploader.upload(file.path, 
            { 
                resource_type: "video",
                public_id:file.filename, 
                folder:('hades/'+auth.nickname), 
                async:false,
                chunk_size: 6000000,
                eager: [
                  { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
                  { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],                                   
                eager_async: true 
            });
        console.log(result)
        
        const newPost = new postsModel({
            user:auth._id,
            nameOfUser:auth.nickname,
            profile_Url:auth.profile_Url,
            comment:comment,
            url:result.url,
            public_id:result.public_id,
            type:'video'
        });
        
        fs.unlink(file.path);
        await newPost.save();
        
        await usersModel.findOneAndUpdate({nickname:auth.nickname}, {$push:{posts:newPost._id}});
    } catch (error) {
        console.error(error);
    }
}


helpers.comment = async (public_id, _id, nickname, comment)=>{
    try {
        const newComment = new commentModel({
            nickname:nickname,
            user:_id,
            comment:comment
        });
        await newComment.save();

        await postsModel.findOneAndUpdate({public_id:public_id},{$push:{comments:newComment._id}});
        return newComment;
    } catch (error) {
        console.error(error);
        return 'error unexpected';
    }
}

helpers.getComments = async (public_id)=>{
    try {
        const comments = [];
        const post = await postsModel.findOne({public_id:public_id});
        for (let x = 0; x < post.comments.length; x++) {
            const comment = await commentModel.findById(post.comments[x]);
            comments.push(comment);
        }
        return comments;
    } catch (error) {
        console.error(error);
        return 'error unexpected';
    }
}

module.exports = helpers;