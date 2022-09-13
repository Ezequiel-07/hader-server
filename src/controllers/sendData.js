const ctrl = {};
const homeHelpers = require("../helpers/home");
const authHelpers = require("../helpers/auth");
const searchHelpers = require("../helpers/search");

ctrl.home = async (req, res) => {
    const { token, sort, from, to } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const options = {
        popularity:homeHelpers.getDataForMorePopular(from, to),
        date:homeHelpers.getDataForTime(from, to),
        following:homeHelpers.getDataForFollowing(from, to, auth.followerOf)
    }
    const values = await options[sort];
    res.status(200).json({values:values});
}

ctrl.search = async (req, res) => {
    const { token, reg } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const result = await searchHelpers.search(reg);
    res.status(200).json({result:result});
}

ctrl.postsOfUser = async (req, res) => {
    const { token, _id } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const values = await searchHelpers.userPosts(_id);

    res.status(200).json({values:values});
}

ctrl.SendUser = async (req, res) => {
    const { token } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    res.status(200).json({user:auth});
}

ctrl.verifyFollow = async (req, res) => {
    const { token, _id } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const foundFollower = await auth.followerOf.filter(element => element == _id);

    if(foundFollower.length != 0){
        return res.status(200).json({value:true});
    }
    return res.status(200).json({value:false});
}
ctrl.verifyBlock = async (req, res) => {
    const { token, _id } = req.body;

    const {errors ,auth} = await authHelpers.tokenVerify(token);

    if(errors.length != 0){
        return res.status(401).json({message:errors});
    }

    const foundBlock = await auth.accountsBlocked.filter(element => element == _id);

    if(foundBlock.length != 0){
        return res.status(200).json({value:true});
    }
    return res.status(200).json({value:false});
}

module.exports = ctrl;