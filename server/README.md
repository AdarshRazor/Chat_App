## Index.js

Create the server

Download Nodemon for better performance

connect to a MongoDB 

## .env

add the Monogo DB connection string to the variable.

## Index.js

now add the monogo db connection string which declared in the `.env` file.

## Server folder

create controller, models and routes folder

## Models

create usermodel.js

## usermodel.js

import mongoose and create userSchema 

## Routes

create a userRoute 

## userRoute.js

create a register user route and export it.

## Index.js

import the user route in the index.js

## Controller (now we create the controller logic for registration)

create a userController and export it to the userRoutes

## userRoutes

now simply import the userController and put it instead of the (req, res)

## userController

Now we need to write the logic for the userController

install bcrypt to more secure the input from the user
install validator to validate the email
install jsonwebtoken verify json web token

create the logic for userController

create a key in `.env` file for id

after creating the token, we can use the same while registering the user

## Testing

now send the request from postman to 'api/users/register' in below formate to test

{
    "name": "john doe",
    "email": "johndoe@gmail.com",
    "password": "somerandompassword"
}

it will be saved in chatapp database under user collection coz in `userModel` we defined it as User.

## UserController

now we create login user function

once done create a login route

## Testing

now test the login method in postman

## move to frontend

now we move to frontend