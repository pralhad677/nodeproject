const express = require('express')
const router = express.Router();
const controller = require('../controller/users')

const authController = require('../controller/authController')
router.param('id',controller.Param)




router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.post('/forgetPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
    '/updateMyPassword',
    authController.protect,
    authController.updatePassword
  );

  
router.patch('/updateMe', authController.protect, controller.updateMe);
router.delete('/deleteMe', authController.protect, controller.deleteMe);

router.route('/').get(authController.protect,authController.restrictTo('admin'),controller.getAllUser).post(controller.addUser);


router.route('/:id').get(controller.getOneUser).put(controller.updateOneUser).delete(controller.deleteOneUser)


module.exports = router