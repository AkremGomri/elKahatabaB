const messageService = require("../services/messageService");
const groupService = require("../services/groupService");
const userService = require("../services/userService");
const socket = require("../services/socketService");

const userSocket = require("../services/userSocket");
const fs = require("fs");
const path = require("path");


exports.getMessage = async (req, res) => {
  try {
    const messages = await messageService.getMany();
    res.status(200).json({ message: "messages ", messages });
  } catch (err) {
    console.log(err);
  }
};

exports.addMessage = async (req, res) => {
  try {
    let body =  null;
    function isJSON(obj) {
      try {
        JSON.parse(obj);
        return true;
      } catch (error) {
        return false;
      }
    }
    if(isJSON(req.body)){

     body = JSON.parse(req.body);
    }
    else{
      body = req.body;
    }
    if (body.file) {
      let { file, fileName, fileType} = body
      fileName = fileName + '_'+(new Date()).getTime()+"."+fileType;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64Data = file.replace(/^data:image\/\w+;base64,/, "");
      // Create a buffer from the base64 data
      const buffer = Buffer.from(base64Data, "base64");

      // Specify the path to the files folder outside of the controller folder
      const filesFolder = path.join(__dirname, "../files");

      // Create the file path
      const filePath = path.join(filesFolder, fileName);

      const afterFileSave = async (pathOfFile = undefined)=>{
        if(pathOfFile){
          pathOfFile = process.env.FILE_URL + `/files/${pathOfFile}`;
        }
        const { sender, receiver, content } = body
        const isRoomExists = await groupService.isExists({
          members: { $all: [sender, receiver] },
        });
        if (!isRoomExists) {
          const senderDetails = await userService.isExists({ _id: sender });
          const receiverDetails = await userService.isExists({ _id: receiver });
          const name = senderDetails.fullname + "," + receiverDetails.fullname;
          if (senderDetails && receiverDetails) {
            const isRoomCreate = await groupService.create({
              name,
              members: [senderDetails, receiverDetails],
            });
            const room_id = isRoomCreate._id;
            // console.log("room datails =====>", isRoomCreate);
            const messages = await messageService.create({
              sender,
              room_id,
              file: pathOfFile,
              content: content ? content : "",
              time: new Date(),
            });
            const recipientSocketId = userSocket.users[receiver];
            const senderSocketId = userSocket.users[sender];
            if (recipientSocketId && senderSocketId) {
              socket.incomingMessage(recipientSocketId, senderSocketId, messages);
            } else {
              console.log("user are not connected in socket");
            }
            res.status(200).json({
              message: "message send successfully",
              room: isRoomCreate,
              messages,
            });
          } else {
            res.status(200).json({
              message: "Users are not exists",
            });
          }
        } else {
          const room_id = isRoomExists._id;
          const messages = await messageService.create({
            sender,
            room_id,
            file: pathOfFile,
            content: content ? content : "",
            time: new Date(),
          });
  
          const recipientSocketId = userSocket.users[receiver];
          const senderSocketId = userSocket.users[sender];
          if (recipientSocketId && senderSocketId) {
            socket.incomingMessage(recipientSocketId, senderSocketId, messages);
          } else {
            console.log("user are not connected in socket");
          }
  
          res.status(200).json({
            message: "message send successfully",
            room: isRoomExists,
            messages,
          });
        }
      }
      // Write the buffer contents to the file
     fs.writeFile(filePath, buffer, (error) => {
        if (error) {
          afterFileSave()
          // Handle the error appropriately
        } else {
          afterFileSave(fileName)
          // File saved successfully
        }
      });
    

    } 
    // If a file doesn't Exist in file
    else {
      // No file was uploaded
      console.log("No file uploaded");
      // Handle the case when no file is uploaded
      const { sender, receiver, content } = body
      // console.log("file info ==>>",req.file,req.body)
      const isRoomExists = await groupService.isExists({
        members: { $all: [sender, receiver] },
      });
      // console.log("check ======>" + isRoomExists);
      if (!isRoomExists) {
        const senderDetails = await userService.isExists({ _id: sender });
        const receiverDetails = await userService.isExists({ _id: receiver });
        const name = senderDetails.fullname + "," + receiverDetails.fullname;
        const isRoomCreate = await groupService.create({
          name,
          members: [senderDetails, receiverDetails],
        });
        const room_id = isRoomCreate._id;
        // console.log("room datails =====>", isRoomCreate);
        const messages = await messageService.create({
          sender,
          room_id,
          content,
          time: new Date(),
        });

        console.log("io ==>", messages);

        const recipientSocketId = userSocket.users[receiver];
        const senderSocketId = userSocket.users[sender];
        if (recipientSocketId && senderSocketId) {
          socket.incomingMessage(recipientSocketId, senderSocketId, messages);
        } else {
          console.log("user are not connected in socket");
        }

        res.status(200).json({
          message: "message send successfully",
          room: isRoomCreate,
          messages,
        });
      } else {
        const room_id = isRoomExists._id;
        const messages = await messageService.create({
          sender,
          room_id,
          content,
          time: new Date(),
        });

        const recipientSocketId = userSocket.users[receiver];
        const senderSocketId = userSocket.users[sender];
        if (recipientSocketId && senderSocketId) {
          socket.incomingMessage(recipientSocketId, senderSocketId, messages);
        } else {
          console.log("user are not connected in socket");
        }

        res.status(200).json({
          message: "message send successfully",
          room: isRoomExists,
          messages,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const messages = await messageService.update(messageId, {
      isActive: false,
    });
    res.status(200).json({ message: "message delete successfully", messages });
  } catch (err) {
    console.log(err);
  }
};

exports.getMessagesByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await messageService.getMany({ sender: id });
    res.status(200).json({ message: "user messages", messages });
  } catch (err) {
    console.log(err);
  }
};

exports.getMessagesByRoomId = async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await messageService.getMany({ room_id: id });
    res.status(200).json({ message: "user messages", messages });
  } catch (err) {
    console.log(err);
  }
};

exports.getRoomChat = async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    const isRoomExists = await groupService.isExists({
      members: { $all: [sender, receiver] },
    });
    console.log("====", isRoomExists);
    const room_id = isRoomExists._id;
    const options = {
      population: [
        {
          path: "sender",
          select: "fullname pseudo Photo gender",
        },
      ],
    };
    const roomChat = await messageService.getMany({ room_id }, options);
    // console.log("====>",roomChat)
    const responeResult = roomChat.map((doc) => ({
      _id: doc?._id,
      content: doc.content,
      sender_id: doc.sender?._id,
      sender_name: doc.sender?.fullname,
      room_id: doc.room_id,
      time: doc.time,
      photo: doc.sender?.Photo,
      gender: doc.sender?.gender,
    }));
    res
      .status(200)
      .json({ message: "room messages", room_id, roomChat: responeResult });
  } catch (err) {
    console.log(err);
  }
};
