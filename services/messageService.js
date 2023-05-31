const Message = require("../models/message");



const  isExists = async (findDto) => (await Message.findOne(findDto)) || false;


const create = async (createDto) => {
    const message = new Message(createDto);
    return (await message.save());
};

const update = async (
    Id,
    updateDto,
    {lean = false, upsert = false, returnNew = true, population = [], session = undefined } = {},
    flatten = true
  )=> {

    try{
        const updatedMessage = Message.findByIdAndUpdate(Id, flatten?{ $set: updateDto}: updateDto, { lean, upsert, new: returnNew });
        return updatedMessage;
    }catch(error){
        throw Error('problem in update');
    }

}
const getMany = async (findDto, options = { population: [], select: [] }) => {
    const message = await Message.find(findDto, options.select)
      .populate(options.population || [])
      .exec();
    if (!message)
      throw new NotFoundError("messages not found", {
        time: new Date(),
        findDto,
      });
    return message;
  };

  const getById = async (Id, { population = [] } = { population: [] }) => {
    const message = await Message.findById(Id).populate(population).exec();
    if (!message){
      throw Error('messages not found');
    }
    return message;
  };






module.exports = { isExists,create,getById,getMany,update} 