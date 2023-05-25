const User =require("../models/User");


const  isExists = async (findDto) => (await User.findOne(findDto)) || false;



module.exports={isExists};