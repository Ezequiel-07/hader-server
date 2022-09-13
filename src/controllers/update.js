const ctrl = {};
const updateHelpers = require("../helpers/update");
const authHelpers = require("../helpers/auth");

ctrl.vetifyNickname = async (req, res) => {
    const { nickname } = req.body;

    const test = await updateHelpers.verifyNickname(nickname);
    res.status(200).json({value:test});
}

ctrl.vetifyEmail = async (req, res) => {
    const { email } = req.body;

    const test = await updateHelpers.verifyEmail(email);
    res.status(200).json({value:test});
}

ctrl.nickname = async (req, res) => {
    const { token, currentNickname, newNickname } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const update = await updateHelpers.nickname(auth.nickname, newNickname);
    console.log(update);

    if(update != ''){
        return res.json(401).status({message:update});
    }

    res.json(200).json({message:update});
}

ctrl.name = async (req, res) => {
    const { token, newName } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const update = await updateHelpers.name(auth._id, newName);

    res.status(200).json({message:update});
}

ctrl.profile_photo = async (req, res) => {
    const { token } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const update = await updateHelpers.profile_photo(req.file, auth);

    res.status(200).json({message:update});
}

ctrl.delete_post = async (req, res) => {
    const { token, id } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const result = await updateHelpers.delete_post(auth._id, auth.roles, id);

    if(result != 'delete'){
        return res.status(401).json({message:result});
    }
    res.status(200).json({message:result});
}

ctrl.follow = async (req, res) => {
    const { token, _id } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const update = await updateHelpers.follow(auth._id, _id);

    if(update != "updated"){
        return res.status(400).json({message:update});        
    }
    res.status(200).json({message:update});
}

ctrl.unfollow = async (req, res) => {
    const { token, _id } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const update = await updateHelpers.unfollow(auth._id, _id);

    if(update != "updated"){
        return res.status(400).json({message:update});        
    }
    res.status(200).json({message:update});
}

ctrl.block = async (req, res) => {
    const { token, _id } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const update = await updateHelpers.block(auth._id, _id);

    if(update != "updated"){
        return res.status(400).json({message:update});        
    }
    res.status(200).json({message:update});
}

ctrl.unlock = async (req, res) => {
    const { token, _id } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const update = await updateHelpers.unlock(auth._id, _id);

    if(update != "updated"){
        return res.status(400).json({message:update});        
    }
    res.status(200).json({message:update});
}

ctrl.updateDescription = async (req, res) => {
    const { token, description } = req.body; 

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }
    
    const result = await updateHelpers.modfidyDescription(auth._id, description);

    if(result == false){
        return res.status(400).json({message:"error unexpected"});
    }
    res.status(200).json({message:"updated"});
}

module.exports = ctrl;