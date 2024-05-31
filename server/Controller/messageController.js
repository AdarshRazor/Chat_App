const messageModel = require('../Models/messageModel')

// create message

const createMessage = async(req, res) => {
    // get chat, senderId, text id from the message
    const {chatId, senderId, text} = req.body

    const message = new messageModel({
        chatId, senderId, text
    })

    try {
        const response = await message.save()

        res.status(200).json(response);

    } catch(error){
        console.log(error);
        //500 means server error
        res.status(500).json(error);
    }
}

// get message
const getMessages = async (req, res) => {

    const {chatId} = req.params

    // we can use the chat id to find the messages

    try {
        // find message of certain chat
        const messages = await messageModel.find({chatId})

        res.status(200).json(messages);

    } catch(error) {
        console.log(error);
        //500 means server error
        res.status(500).json(error);
    }
}


// export the controllers

module.exports = { createMessage, getMessages };