
var express = require('express');
const router = express.Router();
const gmailModel = require('../../models/GmailModel');
const khoDuLieuModel = require("../../models/KhoDuLieuGmailModel");
const configModel = require("../../models/ConfigModel");
router.use((req, res, next) => {
    if (req.user) { req.owner = req.user.username; } else { req.owner = 'anonymous'; }
    next();
  });

router.get('/', async (req,res) =>{
    result = await khoDuLieuModel.find().sort([['_id',1],['isGet',1]]);
    newConfig = await configModel.find();
    
    res.render('gmail/khoDuLieuGmail',{
        userData: req.user,
        active:{
            KhoDuLieu:true
        },
        GmailSlideBarActive:true,
        listData: result,
        newConfig: newConfig
      
    });

});

router.post('/deleteData', async(req,res)=>{
    const result = await khoDuLieuModel.deleteMany();
    console.log(result);

    res.status(200).json({
        success:true,
        msg:'Da xoa toan bo du lieu',
        data:result
    });
});

module.exports = router;