const Contact = require("../models/contactModel");


const sendMessage = async(req,res) =>{
    const {name, email, message} = req.body;

    let newMessage;
    try{
        newMessage = await Contact.create({
            name,email,message
        })

        if(!newMessage){
            return res.status(400).json({msg: "Please Fill All Fields"})
        }
        
        await newMessage.save();
        return res.status(200).json({msg: "Message Sent"});
    }catch(error){
        return res.status(500).json({msg: "An Error occured"});
    }
}

module.exports = {sendMessage};