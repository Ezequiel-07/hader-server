const helpers = {};
const usersModel = require("../models/users");
const jwt = require("jsonwebtoken");

helpers.signup = async (nickname, email, password, roles)=>{
    try {
        const status = [];

        if(nickname == "" || email == ""){
            status.push({error:"the nickname or email are empty"});
            return status;
        }
        if(password == ""){
            status.push({error:"the password is empty"});
            return status;
        }
    
        const authNickname = await usersModel.findOne({nickname:nickname});
        const authEmail = await usersModel.findOne({email:email});
    
        if(authNickname){
            status.push({error:"the nickname is already in use"});
        }
        if(authEmail){
            status.push({error:"the email is already registered"});
        }
    
        return status;
    } catch (error) {
        console.error(error);
    }
}

helpers.signin = async (nickname, email, password)=>{
    try {
        const status = [];

        if( !nickname && !email ){
            status.push({error:"the nickname or email are empty"});
            return {status, token:"error"};
        }
        if( !password ){
            status.push({error:"the password is empty"});
            return {status, token:"error"};
        }
    
        const authNickname = await usersModel.findOne({nickname:nickname});
        const encryptPassword =  [];
    
        if(authNickname){
            encryptPassword.push({password:authNickname.password});
        }else{
            const authEmail = await usersModel.findOne({email:email});
            if(authEmail){
                encryptPassword.push({password:authEmail.password});
            }
            else{
                status.push({error:"the nickname or email not found"});
                return {status, token:"error"};
            }
        }
    
        const authPassword = await usersModel.comparePassword(encryptPassword[0].password,password);
        if(authPassword == false){
            status.push({error:"the password not found"});
            return {status, token:"error"};
        }
        const token = await helpers.jtwSing(nickname, email);
        return {status, token}
    } catch (error) {
        console.error(error);
    }
}

helpers.jtwSing = async (nickname, email)=>{
    try {
        const authNickname = await usersModel.findOne({nickname:nickname});
        if(authNickname){
            const id = authNickname._id;
            const token = jwt.sign({id:id}, process.env.JWT_KEY,{
                expiresIn: 60 * 60 * 24
            });
            return token;
        }else{
            const authEmail = await usersModel.findOne({email:email});
            const id = authEmail._id;
            const token = jwt.sign({id:id}, process.env.JWT_KEY,{
                expiresIn: 60 * 60 * 24
            });
            return token;
        }
    } catch (error) {
        console.error(error);
    }
}

helpers.tokenVerify = async (token)=>{
    const errors = [];
    if(!token){
        errors.push({error:"token don't exist"});
        return {errors, auth:"error"};
    }
    const verify = [];
    try {
        const result = jwt.verify(token, process.env.JWT_KEY)
        verify.push({id:result.id});
    } catch (error) {
        errors.push({error:"token invalid"});
        return {errors, auth:"error"};
    }
    
    const auth = await usersModel.findById(verify[0].id);
    return {errors, auth};
}

module.exports = helpers;