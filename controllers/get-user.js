/** @type {import("express").RequestHandler} */

const User = require("../models/User");

const get = async (req, res) => {
  const { page = 1 } = req.query;

  const query = req.mappedQuery;

  const limit = 10;
  const usersProjection = {
    __v: false,
    seq: false,
  };
  const users = await User.find(query, usersProjection)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const total = await User.countDocuments(query);
  return res.json({
    ok: true,
    users,
    totalUsers: total,
    totalPages: Math.ceil(total / limit),
    currentPage: +page,
  });
};

module.exports = get;
