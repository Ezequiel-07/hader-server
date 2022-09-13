const helpers = {};
const usersModel = require("../models/users");
const postsModel = require("../models/posts");
const libs = require("../libs/index");

helpers.getDataForMorePopular = async (from, to)=>{
    try {
        const values = await postsModel.find().sort({"likes":-1}).limit(500);
        const selection = values.slice(from, to);
        return selection;
    } catch (error) {
        console.error(error);
    }
}
helpers.getDataForTime = async (from, to)=>{
    try {
        const values = await postsModel.find().sort({"date":-1}).limit(500);
        const selection = values.slice(from, to);
        return selection;
    } catch (error) {
        console.error(error);
    }
}
helpers.getDataForFollowing = async (from, to, following)=>{
    try {
        const values = [];
        for (let x = 0; x < following.length; x++) {
            const posts = await postsModel.find({user:following[x]}).sort({"date":-1}).limit(1);
            values.push(posts[0]);
        }
        values.slice(from, to);
        values.sort(libs.sortForDate);
        return values;
    } catch (error) {
        console.error(error);
    }
}

module.exports = helpers;