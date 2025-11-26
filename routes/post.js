const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPost, likePost, getFeed } = require('../controllers/postController');


router.post('/', auth, createPost);
router.post('/:id/like', auth, likePost);
router.get('/feed', getFeed); 


module.exports = router;