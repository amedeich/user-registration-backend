/** @type {import("express").RequestHandler} */
/** @type {import("mongoose").RequestHandler} */

const createUser = require("./create-user");

const create = createUser;

module.exports = {
  create,
};
