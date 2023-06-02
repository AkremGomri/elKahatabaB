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
module.exports={isExists ,getMany,getById};