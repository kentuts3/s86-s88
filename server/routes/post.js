const express = require('express');
const postController = require('../controllers/post');


const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post('/addPost', verify, postController.addPost);

router.get('/getPosts', verify, postController.getPosts);

router.get('/getPost/:id', verify, postController.getPost)

router.put('/updatePost/:id', verify, postController.updatePost);

router.delete('/deletePost/:id', verify, postController.deletePost);

router.post('/addComment/:postId', verify, postController.addComment);

router.get('/getPostWithComments/:postId', verify, postController.getPostWithComments);

router.delete('/:postId/deleteComment/:commentId', verify, postController.deleteComment);



module.exports = router;