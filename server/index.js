const express = require('express');
const cors = require('cors'); // allow us to interact with frontend
const mongoose = require('mongoose');
require('dotenv').config();
const userRoute = require('./Routes/userRoute')

const app = express();

//allow use to recieve and send json data (Miidleware Func)
app.use(express.json());
app.use(cors()); // add extra capabilities to app


// Routes and middleware
app.get('/', (req, res) => {
    res.send('Hello World this is the page');
})

app.use('/api/users',userRoute)



// Ports and connections
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI; // we are reading the `ATLAS_URI` from the file using the dotenv package which we installed earlier

app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
})

// use mongoose to connect to mongodb server
mongoose.connect(uri).then(() => console.log('Congrats !! Connected to MongoDB')).catch((err) => console.log('MongoDB connection failed: ',err.message))