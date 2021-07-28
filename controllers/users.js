/** @type {import("express").RequestHandler} */

const create = (req, res) => {
  res.json({
    ...req.body,
    ok: true,
  });
};

module.exports = {
  create,
};
