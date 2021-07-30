/** @type {import("express").RequestHandler} */
/** @type {import("mongoose").RequestHandler} */

const createUser = require("./create-user");
const getUsers = require("./get-user");
const removeUser = require("./delete-user");

const create = createUser;

const get = getUsers;

const remove = removeUser;

module.exports = {
  create,
  get,
  remove,
};
