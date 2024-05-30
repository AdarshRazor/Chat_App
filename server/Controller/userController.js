const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

// const createToken = (_id) => {
//     return jwt.sign({_id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
// }

// or 

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;

    return jwt.sign({_id}, jwtkey, {expiresIn: '3d'});
}

// here we can change the output of the route
// const registerUser = (req, res) => {
//     res.send('register a new user');
// }

// since we are using await function then we have to add async
const registerUser = async (req, res) => {

    // since we are using await function then we can use try and catch errors to catch them
    try {
        const {name, email, password} = req.body;

        let user = await userModel.findOne({ email });
    
        if(!name ||!email ||!password){
            return res.status(422).json("please add all the fields");
        }
    
        if(!validator.isEmail(email)){
            return res.status(422).json("please add a valid email");
        }
    
        if(password.length < 5){
            return res.status(422).json("password should be atleast 6 characters");
        }

        // if user exists then throw this msg
        if(user) return res.status(400).json("User already exists")
    
        user = new userModel({name, email, password})
    
        // before we save the user we neeed to hash the password
        // we are using await because of async function
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        await user.save();
    
        const token = createToken(user._id);
    
        // now we can send the data to the client
    
        res.status(200).json({_id: user._id, name, email, token});

    }catch(err) {
        console.log(err);
        //500 means server error
        res.status(500).json({error: err});
    }
}


// logging user

const loginUser = async (req, res) => {
    
    // extract the email and password from the body
    const {email, password} = req.body;

    try {
            // find a user
    let user = await userModel.findOne({ email });
    // if user does not exist then throw this error
    if(!user) return res.status(422).json({error: 'invalid email or password'});

    const isValidPassword = await bcrypt.compare(password, user.password);

    // if password is not valid then throw this error
    if(!isValidPassword) return res.status(422).json({error: 'Something went wrong :p'});

    const token = createToken(user._id);
    // now we can send the data to the client
    res.status(200).json({_id: user._id, name: user.name , email, token});
    }catch(err){
        console.log(err);
        //500 means server error
        res.status(500).json({error: err});
    }
}

module.exports = {registerUser, loginUser};