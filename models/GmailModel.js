const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GmailSchema = new Schema({
    username: {type:String},
    password:{type:String},
    phoneNumber: {type:String},
    deviceName: {type:String},
    fullName: {type:String},
    first_name: {type:String},
    last_name_group: {type:String},
    ipAddr: {type:String},
    status: {type:Boolean},
    isBackUp: {type:Boolean},
    passwordLZD: {type:String},
    isRecovery : {type:Boolean},
    created:{type:Date, default:Date.now}
});

const Gmail = mongoose.model('gmail',GmailSchema,'gmails');
module.exports = Gmail;