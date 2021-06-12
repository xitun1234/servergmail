var express = require('express');
const router = express.Router();
const gmailModel = require('../../models/GmailModel');
const utilsHelper = require('../../utils/UtilsHelper');
router.use((req, res, next) => {
    if (req.user) { req.owner = req.user.username; } else { req.owner = 'anonymous'; }
    next();
  });

router.get('/', async function(req, res) {
    const filter = {
        ...req.query
    }
    
    const accounts = await gmailModel.find().exec((err,result)=>{

        res.render('gmail/account',{
            userData:req.user,
            GmailSlideBarActive:true,
            active:{
              QuanLyGmailLive: true
            },
            listAccount : result,
            form:{
                //limit:req.query.limit || 100,
            }
        });
    });

    
});

router.post('/export', async(req,res,next) =>{
    const filter = {
        owner: req.owner,
        ...req.body
      }
      console.log(filter)
      
      const pathExcel = `download/acc_gmail_${Date.now()}.xlsx`;
      const dataExcel = [];
    
      const accountGmail = await gmailModel.find().limit(filter.limit).exec((err, result) => {
        result.forEach((rowExcel) => {
          
          const dataExtract = {
            'Gmail': rowExcel.username,
            'Mật khẩu': rowExcel.password,
            'SĐT': rowExcel.phoneNumber,
            'Thiết bị tạo': rowExcel.deviceName,
            'Họ Tên': rowExcel.fullName,
            'IP': rowExcel.ipAddr,
            'Backup': rowExcel.isBackUp,
            'Trạng thái': rowExcel.status
          }
    
          
          if (dataExcel.length == 0) { dataExcel.push(Object.keys(dataExtract)); }
          dataExcel.push(Object.values(dataExtract));
         
          utilsHelper.renderExcel(pathExcel,dataExcel);
          
        })
      });
      
      
      res.json({
        success:true,
        pathExcel,
      });
   
})



module.exports = router;