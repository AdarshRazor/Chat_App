const express = require('express');
const router = express.Router();

const {createchat, findUserChats, findChat} = require('../Controller/chatController')

router.post('/', createchat);
router.get('/:userId', findUserChats);
router.get('/find/:firstId/:secondId', findChat);

module.exports = router;