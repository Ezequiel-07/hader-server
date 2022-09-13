const ctrl = {};
const postsHelpers = require("../helpers/posts");
const authHelpers = require("../helpers/auth");
const postsModel = require("../models/posts");


ctrl.publish = async (req, res) => {
    const { token, comment } = req.body;
    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(auth.roles == "viewer"){
        return res.status(401).json({message:"you are not authorized to publish"})
    } 
    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }
    if(!req.file.path){
        return res.status(404).json({message:"file not found"})
    }

    await postsHelpers.publish(req.file, auth, comment);
    res.status(200).json({message:"publish"});
}

ctrl.publishVideo = async (req, res) => {
    const { token, comment } = req.body;
    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(auth.roles == "viewer"){
        return res.status(401).json({message:"you are not authorized to publish"})
    } 
    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }
    if(!req.file.path){
        return res.status(404).json({message:"file not found"})
    }
    console.log('file:' + req.file);
    await postsHelpers.publishVideo(req.file, auth, comment);
    res.status(200).json({message:"publish"});
}

ctrl.comment = async (req, res) => {
    const {token, comment, public_id} = req.body;
    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }
    if(!comment || !public_id){
        return res.status(401).json({message:"comment or post are empty"});
    }
    const publish = await postsHelpers.comment(public_id, auth._id, auth.nickname, comment);
    if(publish == "error unexpected"){
        return res.status(400).json({message:publish});
    }
    res.status(200).json({message:publish});
}

ctrl.sendComments = async (req, res) => {
    const { public_id, token } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const result = await postsHelpers.getComments(public_id);

    if(result == 'error unexpected'){
        return res.status(400).json({message:result});
    }
    res.status(200).json({message:result});
}

ctrl.like = async (req, res) => {
    const {token, public_id} = req.body;
    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }
    if(!public_id){
        return res.status(401).json({message:"post is empty"});
    }

    try {
        const post = await postsModel.findOne({public_id:public_id});
        const verify = await post.likesId.filter(element => element == auth._id);
        if(verify.length != 0){
            return res.status(401).json({message:"you give already liked"});
        }
        await post.update({likes:(post.likes += 1), $push:{likesId:auth._id}});
    } catch (error) {
        console.error(error);
        return res.status(400).json({message:"unexpected error"});
    }
    res.status(200).json({message:"added"});
}

ctrl.dislike = async (req, res) => {
    const {token, public_id} = req.body;
    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }
    if(!public_id){
        return res.status(401).json({message:"post is empty"});
    }

    try {
        const post = await postsModel.findOne({public_id:public_id});
        const verify = await post.likesId.filter(element => element == auth._id);
        if(verify.length == 0){
            return res.status(401).json({message:"you not give liked"});
        }
        await post.update({likes:(post.likes -= 1), $pull:{likesId:auth._id}});
    } catch (error) {
        console.error(error);
        return res.status(400).json({message:"unexpected error"});
    }
    res.status(200).json({message:"added"});
}

ctrl.comprobateLike = async (req, res) => {
    const {token, public_id} = req.body;
    const { errors, auth } = await authHelpers.tokenVerify(token);
    if(errors.length != 0){
        return res.status(401).json({message:"not loged"});
    }
    if(!public_id){
        return res.status(401).json({message:"post is empty"});
    }

    const post = await postsModel.findOne({public_id:public_id});
    const verify = await post.likesId.filter(element => element == auth._id);
    console.log(verify)
    if(verify.length != 0){
        return res.status(200).json({value:true});
    }
    res.status(200).json({value:false});
}

module.exports = ctrl;