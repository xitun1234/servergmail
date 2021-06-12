const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KhoDuLieuGmailSchema = new Schema({
    username: {type:String},
    password: {type:String},
    deviceName: {type:String},
    phoneNumber: {type:String},
    fullName: {type:String},
    first_name: {type:String},
    last_name_group: {type:String},
    status: {type:Boolean},
    isGet: {type: Boolean},
    moTa: {type:String},
    created:{type:Date, default:Date.now}
});

const KhoDuLieuGmail = mongoose.model('KhoDuLieuGmail',KhoDuLieuGmailSchema,'khodulieugmail');
module.exports = KhoDuLieuGmail;