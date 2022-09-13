const ctrl = {};
const usersModel = require("../models/users");
const rolesModel = require("../models/roles");
const authHelpers = require("../helpers/auth");

ctrl.signup = async (req, res) => {
    const { nickname, name, email, password, phone, roles } = req.body;
    const status = await authHelpers.signup(nickname, email, password, roles);

    if(status.length != 0){
        return res.status(401).json({error:status});
    }
    if(!phone){
        phone = "0";
    }

    const authRoles = await rolesModel.findById(roles);

    const newUser = new usersModel({
        nickname:nickname,
        name:name,
        email:email,
        password: await usersModel.encryptPassword(password),
        phone:phone,
        roles:authRoles.name
    });


    await newUser.save();
    const token = await authHelpers.jtwSing(nickname, email);
    return res.status(200).json({message:"saved", token:token});
}

ctrl.signin = async (req, res) => {
    const { nickname, email, password } = req.body;
    const {status, token} = await authHelpers.signin(nickname, email, password);
    console.log(status)

    if(status.length != 0){
        return res.status(401).json({error:status});
    }

    return res.status(200).json({message:"loged", token:token});
}

ctrl.tokenVerify = async (req, res) => {
    const { token } = req.body;
    const { errors, auth } = await authHelpers.tokenVerify(token);
    if(errors.length != 0){
        return res.status(401).json({message:"not loged"});
    }
    res.status(200).json({auth:auth});
}
module.exports = ctrl;