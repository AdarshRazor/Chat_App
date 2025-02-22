const chatModel = require('../Models/chatModel')

// createchat

const createchat = async(req, res) => {
    const {firstId, secondId} = req.body

    // if chat already exists

    try{
        const chat = await chatModel.findOne({
            // $all is a mongodb opterator
            members: {$all: [firstId, secondId]}
        })

        // if chat already exists
        if(chat) return res.status(200).json(chat);

        // if chat does not exist then create a new chat
        const newChat = new chatModel({
            members: [firstId, secondId]
        })

        //now save these chat to db and send to frontend
        const response = await newChat.save()

        res.status(200).json(response);

    } catch(err) {
        console.log(err);
        //500 means server error
        res.status(500).json(error);
    }
}

// find user chats

const findUserChats = async(req, res) => {
    const userId = req.params.userId;

    try{
        const chats = await chatModel.find({
            members: {$in: [userId]}
        })

        res.status(200).json(chats);
    } catch(error) {
        console.log(error);
        //500 means server error
        res.status(500).json(error);
    }
}

// find chat (1 - one)

const findChat = async(req, res) => {
    const {firstId, secondId} = req.params;


    try{
        const chat = await chatModel.findOne({
            members: {$all: [firstId, secondId]}
        })

        res.status(200).json(chat);
    } catch(error) {
        console.log(error);
        //500 means server error
        res.status(500).json(error);
    }
}

module.exports = {createchat, findUserChats, findChat};