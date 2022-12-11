const Discussion = require('../models/Room');

exports.getDiscussion = async (roomId) => {
    const discussion = await Discussion.findOne(roomId);
    return discussion;
};

exports.saveMessage = async (roomId, newMessage) => {
    const discussion = await Discussion.findOne(roomId);
    discussion.messages.push(newMessage);

    try{
        discussion.save();
        return 1;
    } catch(err) {
        console.log("controllers/room::saveMessage ",err);
        return -1;
    }
};

exports.getAllConversations = async (req, res) => {
    const discussions = await Discussion.find();
    res.status(203).json(discussions);
}

exports.deleteConversation = async (req, res) => {
    const discussion = await Discussion.findOne(req.params.roomId);
    discussion.messages = [];
    discussion.save()
        .then(() => res.status(203).json({ message: "successfully deleted" }))
        .catch((err) => res.status(400).json({ message: "could not delete with error: ",err}));
};