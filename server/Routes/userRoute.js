const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../Controller/userController')

// router.post('/register', (req, res) => {
//     res.send('register');
// })

// instead of that now since we imported the registerUser controller we can simply use

router.post('/register', registerUser);

router.post('/login', loginUser)

module.exports = router;