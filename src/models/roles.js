const { Schema, model } = require("mongoose");

const rolesSchema = new Schema({
    name: String,
}, {versionkey: false});

module.exports = model("roles", rolesSchema);