# Front End

Create the Navbar, Register Page, Login Page

Import Bootstrap React 

## Context API

Create a context folder in src and AuthContent.js

### AuthContext.js

use createContext and export the auth context

create authcontextprovider and wrap it around the app conponent as its the parents 

create the values in authcontextprovider, which we want to use and by making use of {useContext} we can import it anywhere

put the values in authcontextprovider which we want to use

### Register.js

include registerInfo and create a onchange event on each form.

now we register a user to backend 

## Register a user

performa  http to backend api and register a user

## Protecting Routes

use user context and make change in the app.js. If the user is logged in then go to chat or else move to Login, Register page.

After that change the navbar: logged in as and import the currect user there from context api

Change the login and logout button based on either the user is logged in or logged out.

Hide the register and login button and logged in as part

## Login user

create the login usestate for the users in the authcontext and import those in the login.js

# Now move to Socket.io

