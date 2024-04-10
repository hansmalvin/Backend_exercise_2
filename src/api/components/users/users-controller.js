const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('../authentication/authentication-service');
const usersRepository = require('./users-repository');
const { User } = require('../../../models');


/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers(email);
    return response.status(409).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    if(password !== password_confirm){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
      );
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'EMAIL_ALREADY_TAKEN'
      );
    }

    return response.status(409).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function newpw(request, response, next){
  try{
    const id = request.params.id;
    const email = request.body.email;
    const OldPassword = request.body.OldPassword;
    const NewPassword = request.body.NewPassword;
    const new_password_confirm = request.body.new_password_confirm;


    if(NewPassword !== new_password_confirm){
      throw errorResponder(errorTypes.INVALID_PASSWORD);
    }

    const loginSuccess = await authenticationServices.checkLoginCredentials(email,OldPassword)
    
    if(!loginSuccess){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Wrong Password'
      )
    }

    const success = await usersService.newpw(id,NewPassword);

    if(!success){
      throw errorResponder(errorTypes.INVALID_CREDENTIALS),
      'Wrong Credentials'
    }

    return response.status(409).json({id,NewPassword});
  }catch(error){
    return next(error)
  }
}
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'EMAIL_ALREADY_TAKEN'
      );
    }

    return response.status(409).json({ id});
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  newpw,
};
