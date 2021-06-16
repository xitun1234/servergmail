const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConfigSchema = new Schema({

    passwordLZD: {type:String},
   
    created:{type:Date, default:Date.now}
});

const Config = mongoose.model('Config',ConfigSchema,'configs');
module.exports = Config;