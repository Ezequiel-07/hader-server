const helpers = {};
const usersModel = require("../models/users");
const postsModel = require("../models/posts");

helpers.search = async (reg)=>{
    try {        
        const search = RegExp(reg);
        const result = await usersModel.find({nickname:search});
        return result;
    } catch (error) {
        console.error(error);
        return error;
    }
}
helpers.userPosts = async (_id)=>{
    try {
        const posts = await postsModel.find({user:_id});
        return posts;
    } catch (error) {
        console.error(error)
    }
}

module.exports = helpers;