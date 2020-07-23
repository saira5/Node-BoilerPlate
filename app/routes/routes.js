'use strict';

var express = require('express');
var router = express.Router();
var cors = require('cors');
var connectMultiparty = require('connect-multiparty');
var multipartMiddleware = connectMultiparty();


var controller = {
    home: require('../controllers/home'),
    userCtrl: require('../controllers/user'),
    icdb: require('../icdb'),
};

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  router.use(cors()) ;
// home page route
router.get('/', controller.home.index);
router.get('/api/user/me', cors(), controller.userCtrl.getLoggedUser);
router.post('/api/user/login', cors(), controller.userCtrl.login);
router.post('/api/user/logout', cors(), controller.userCtrl.logout);
router.post('/api/user/register', cors(), controller.userCtrl.register);
router.post('/api/user/registerUser', cors(), controller.userCtrl.registerUser);
router.post('/api/user/forgetpass', cors(), controller.userCtrl.forgetpass);
router.post('/api/user/resetforgetpass', cors(), controller.userCtrl.resetforgetpass);


router.post('/api/common/get-data', cors(), controller.icdb.getData);
router.post('/api/common/get-condition', cors(), controller.icdb.getCondition);
router.post('/api/common/single-data', cors(), controller.icdb.getSingle);
router.post('/api/common/edit-data', cors(), controller.icdb.getEditData);
router.post('/api/common/delete', cors(), controller.icdb.getDeleteData);
router.post('/api/common/delete-condition', cors(), controller.icdb.getDeleteDataCondition);
router.post('/api/common/single', cors(), controller.icdb.getSingleData);
router.post('/api/common/add-data', cors(), controller.icdb.postAddData);



module.exports = router;
