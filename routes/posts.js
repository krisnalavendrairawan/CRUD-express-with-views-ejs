var express = require('express');
var router = express.Router();

//import database
// var connection = require('../library/database');
const postController = require('../controllers/postController');
const usersController = require('../controllers/usersController');
const authenticate = require('../middlewares/authenticate');



//register
router.get('/users/register', usersController.getRegister);
router.post('/users/register', usersController.register);

//login
router.get('/users/login', usersController.getLogin);
router.post('/users/login', usersController.login);

//logout
router.post('/users/logout', usersController.logout);

/**
 * INDEX POSTS
 */


router.get('/', authenticate,  postController.getAllposts);

// create posts
router.get('/create', authenticate, postController.createPost);

router.post('/store', authenticate, postController.storePost);

//edit posts
router.get('/edit/(:id)', authenticate, postController.editPost);

router.post('/update/(:id)', authenticate, postController.updatePost);

//delete posts
router.get('/delete/(:id)', authenticate, postController.deletePost);




module.exports = router;