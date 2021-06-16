var express = require('express');
var router = express.Router();
const userController = require('../controllers/User.controller');
const checkJWT = require('../middlewares/check-jwt');

const accountModel = require('../models/LazadaAccountModel');

const userModel = require('../models/UserModel');

const gmailModel = require('../models/GmailModel');
const configModel = require('../models/ConfigModel');

const utilsHelper = require('../utils/UtilsHelper');
const khoDuLieuGmailModel = require('../models/KhoDuLieuGmailModel');

const fs = require('fs');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/addUser', async (req, res) => {
  let newUser = new userModel();
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  newUser.fullname = req.body.fullname;

  newUser.save();

  res.json({
    success: true,
    data: newUser,
  });
});

router.get('/test', async (req, res) => {
  const filter = {
    ...req.body,
  };
  const pathExcel = `download/acc_gmail_${Date.now()}.xlsx`;
  const dataExcel = [];

  const accountGmail = await gmailModel
    .find()
    .limit(5)
    .exec((err, result) => {
      result.forEach((rowExcel) => {
        const dataExtract = {
          Gmail: rowExcel.gmail + '@gmail.com',
          'Mật khẩu': rowExcel.password,
          SĐT: rowExcel.phone,
          'Thiết bị tạo': rowExcel.deviceName,
          'Họ Tên': rowExcel.full_name,
          IP: rowExcel.ipAddr,
          Restore: rowExcel.isRestore,
          Backup: rowExcel.isBackUp,
          'Trạng thái': rowExcel.status,
        };

        if (dataExcel.length == 0) {
          dataExcel.push(Object.keys(dataExtract));
        }
        dataExcel.push(Object.values(dataExtract));

        utilsHelper.renderExcel(pathExcel, dataExcel);
      });
    });

  res.json({
    success: true,
    pathExcel,
  });
});

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find that file');
      resolve(data);
    });
  });
};

router.get('/getfullname', async (req, res) => {
  const fileData = await readFilePro(`${__dirname}/../config/output.json`);
  const dataJson = JSON.parse(fileData);

  let randomIndex = Math.floor(Math.random() * dataJson.length);
  console.log(dataJson[randomIndex]);

  res.status(200).json({
    status: 'success',
    fullname: dataJson[randomIndex].full_name,
  });
});

router.get('/create', userController.createAccount);
router.post('/Login', userController.LoginUser);

function getRandomString(length) {
  var randomChars = 'abcdefghijklmnopqrstuvwxyz';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

function getRandomNumber(length) {
  var randomChars = '0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' '
  );
  return str;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function randomFullname() {
  const fileData = await readFilePro(`${__dirname}/../config/output.json`);
  const dataJson = JSON.parse(fileData);

  let randomIndex = Math.floor(Math.random() * dataJson.length);

  const fullName =
    dataJson[randomIndex].last_name_group +
    ' ' +
    dataJson[randomIndex].first_name;
  return fullName;
}

router.post('/setkhodulieu', async (req, res) => {
  const configLZD = await configModel.find();
  let duLieu = new khoDuLieuGmailModel();

  //init
  const username = req.body.username;
  const password = req.body.password;
  const passwordLZD = configLZD[0].passwordLZD;
  console.log(password);

  const fileData = await readFilePro(`${__dirname}/../config/output.json`);
  const dataJson = JSON.parse(fileData);

  let randomIndex = Math.floor(Math.random() * dataJson.length);

  const passwordNgauNhien =
    removeVietnameseTones(dataJson[randomIndex].last_name_group) +
    removeVietnameseTones(dataJson[randomIndex].first_name).toLowerCase() +
    getRandomNumber(getRndInteger(3, 6));

  //set
  duLieu.username = username;
  if (password) {
    duLieu.password = password;
  } else {
    duLieu.password = passwordNgauNhien;
  }
  duLieu.passwordLZD = passwordLZD;
  duLieu.fullName = dataJson[randomIndex].full_name;
  duLieu.first_name = dataJson[randomIndex].first_name;
  duLieu.last_name_group = dataJson[randomIndex].last_name_group;
  duLieu.status = false;
  duLieu.isGet = false;
  //save
  duLieu.save();

  res.json({
    success: true,
    data: duLieu,
  });
});

router.get('/getKhoDuLieu&deviceName=:deviceName', async (req, res) => {
  const filter = {isGet: false};
  const update = {
    isGet: true,
    deviceName: req.params.deviceName,
    moTa: `Đã nạp dữ liệu cho Máy ${req.params.deviceName}`,
  };
  

  let doc = await khoDuLieuGmailModel.findOneAndUpdate(filter, update, {
    new: true,
    sort:{username: 1}
  });

  if (doc) {
    res.json({
      status: 'success',
      data: doc,
    });
  } else {
    res.json({
      status: 'fail',
      data: null,
    });
  }
});

router.get('/getDataGmail&deviceName=:deviceName', async (req, res) => {
  const infoData = await khoDuLieuGmailModel.findOne(
    {
      deviceName: req.params.deviceName,
      isGet: true,

    },
    {},
    {sort: {username: -1}}
  );
  console.log(infoData)

  if (infoData) {
    res.json({
      status: 'success',
      data: infoData,
    });
  } else {
    res.json({
      status: 'fail',
      data: null,
    });
  }
});

router.post('/addAccountGmail', async (req, res) => {
  let newAccountGmail = new gmailModel();
  newAccountGmail.username = req.body.username;
  newAccountGmail.password = req.body.password;
  newAccountGmail.phoneNumber = req.body.phoneNumber;
  newAccountGmail.deviceName = req.body.deviceName;
  newAccountGmail.fullName = req.body.fullName;
  newAccountGmail.first_name = req.body.first_name;
  newAccountGmail.last_name_group = req.body.last_name_group;
  newAccountGmail.ipAddr = req.body.ipAddr;
  newAccountGmail.status = req.body.status;
  newAccountGmail.isBackUp = false;
  newAccountGmail.passwordLZD = req.body.passwordLZD;


  const test = (req.body);
  console.log(test);



  newAccountGmail.save();

  res.json({
    success: true,
    data: newAccountGmail,
  });
});

router.post('/updateKhoDuLieu', async (req, res) => {
  const filter = {username: req.body.username, deviceName: req.body.deviceName, isGet:true};
  const update = {
    status: true,
    moTa: `Đã tạo thành công gmail`,
  };

  let doc = await khoDuLieuGmailModel.findOneAndUpdate(filter, update, {
    new: true,
  });

  if (doc) {
    res.json({
      status: 'success',
      data: doc,
    });
  } else {
    res.json({
      status: 'fail',
      data: null,
    });
  }
});

router.post('/updateConfig', async (req, res) => {
  
  const update = {
    passwordLZD: req.body.passwordLZD,
  };
  let resultUpdate = await configModel.findOneAndUpdate('', update,{
    new: true
  });


  res.status(200).json({
    success: true,
    data: resultUpdate,
  });
});

router.post('/updateRecovery', async (req, res) => {
  const filter = {username: req.body.username, deviceName: req.body.deviceName};
  const update = {
    isRecovery: req.body.isRecovery,
  };

  let doc = await gmailModel.findOneAndUpdate(filter, update, {
    new: true,
  });

  if (doc) {
    res.json({
      status: 'success',
      data: doc,
    });
  } else {
    res.json({
      status: 'fail',
      data: null,
    });
  }
});

module.exports = router;
