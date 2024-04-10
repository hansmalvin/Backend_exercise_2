const { errorResponder, errorTypes } = require('../../../core/errors');
const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers(email) {
  return User.find({email});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  try{
    const testt = await User.findOne({email});

    if(testt){
      throw errorResponder(errorTypes.EMAIL_ALREADY_TAKEN)
    }
  const NewUser = await User.create({
    name,
    email,
    password,
  });

  return NewUser;
  }catch(error){
    return next(error);
  }
}

async function newpw(id, NewPassword){
  return await User.updateOne({_id:id},{password:NewPassword})
}



/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  try{
    testem = await User.findOne({email});
    if(testem){
      throw errorResponder(errorTypes.EMAIL_ALREADY_TAKEN);
    }
  
  const newUpdate = await User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
  return newUpdate;
  }catch(error){
    return next(error);
  }
}


/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  newpw,
};
