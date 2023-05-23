const Group = require("../models/group");;



const  isExists = async (findDto) => (await Group.findOne(findDto)) || false;


const create = async (createDto) => {
    const group = new Group(createDto);
    return (await group.save());
};

const update = async (
    Id,
    updateDto,
    {lean = false, upsert = false, returnNew = true, population = [], session = undefined } = {},
    flatten = true
  )=> {

    try{
        const updatedGroup = Group.findByIdAndUpdate(Id, flatten?{ $set: updateDto}: updateDto, { lean, upsert, new: returnNew });
        return updatedGroup;
    }catch(error){
        throw Error('problem in update');
    }

}
const getMany = async (findDto, options = { population: [], select: [] }) => {
    const groups = await Group.find(findDto, options.select)
      .populate(options.population || [])
      .exec();
    if (!groups)
      throw new NotFoundError("group not found", {
        time: new Date(),
        findDto,
      });
    return groups;
  };

  const getById = async (Id, { population = [] } = { population: [] }) => {
    const group = await Group.findById(Id).populate(population).exec();
    if (!group){
      throw Error('group not found');
    }
    return group;
  };






module.exports = { isExists,create,getById,getMany,update} 