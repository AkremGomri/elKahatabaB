const User =require("../models/User");


const  isExists = async (findDto) => (await User.findOne(findDto)) || false;

const getMany = async (findDto, options = { population: [], select: [] }) => {
    const users = await User.find(findDto, options.select)
      .populate(options.population || [])
      .exec();
    if (!users)
      throw new NotFoundError("messages not found", {
        time: new Date(),
        findDto,
      });
    return users;
  };

  const getById = async (Id,options = { population: [], select: [] }) => {
    const user = await User.findById(Id,options.select).populate(options.population).exec();
    if (!user){
      throw Error('group not found');
    }
    return user;
  };



  const update = async (
    Id,
    updateDto,
    {lean = false, upsert = false, returnNew = true, population = [], session = undefined } = {},
    flatten = true
  )=> {

    try{
        const updatedUser = User.findByIdAndUpdate(Id, flatten?{ $set: updateDto}: updateDto, { lean, upsert, new: returnNew });
        return updatedUser;
    }catch(error){
        throw Error('problem in update');
    }

}

module.exports={isExists ,getMany,getById,update};