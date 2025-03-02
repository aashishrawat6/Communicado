import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); // it will not select your id and your password

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // i gave name to id for better understanding
    const myId = req.user._id; // our Id

    // creating a filter to find messages between two users i.e., where i am the sender or other person has sent me a message
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
    try {
        const{text, image}=req.body;
        const{id:receiverId}=req.params; // id of the user to whom we are sending message got from params renaming it to receiverId
        const senderId=req.user._id; // our id

        //checking if user is passing image or not
        let imageUrl;
        if(image){
            // upload base64 image to cloudinary
        const uploadedResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl, // either image or undefined value
        });

        await newMessage.save(); // saving message to database

        //realtime functionality using socket.io
        const recieverSocketId = getRecieverSocketId(receiverId); // getting the socket id of the receiver from newMessage - recieverId
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage", newMessage); // sending the message to the receiver, used io.to() to send message to a specific user not to all the users
        };

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
