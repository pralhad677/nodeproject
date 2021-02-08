const express = require('express')
const router = express.Router();
const controller = require('../controller/practice')

// const authController = require('../controller/authController')
// router.param('id',controller.Param)




// router.post('/signup', authController.signUp);
// router.post('/login', authController.login);

// router.post('/signup', authController.forgetPassword);

// router.post('/signup', authController.resetPassword);

// router.route('/').get(authController.protect,authController.restrictTo('admin'),controller.getAllUser).post(controller.addUser);


// router.route('/:id').get(controller.getOneUser).put(controller.updateOneUser).delete(controller.deleteOneUser)


router.route('/').get(controller.getName).post(controller.add)


module.exports = router