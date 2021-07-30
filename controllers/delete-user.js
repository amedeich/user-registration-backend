/** @type {import("express").RequestHandler} */

const { isValidObjectId } = require("mongoose");
const User = require("../models/User");

const remove = async (req, res) => {
  const { id: _id } = req.params;
  if (!isValidObjectId(_id)) {
    return res.status(404).json({
      msg: "El usuario no existe.",
      ok: false,
    });
  }
  try {
    const removed = await User.deleteOne({ _id });
    if (removed.deletedCount === 0) {
      throw new Error({ err: "El usuario no fue encontrado." });
    }
    return res.status(204).json({});
  } catch (error) {
    return res.status(409).json({
      msg: "No se pudo eliminar el usuario.",
      ok: false,
    });
  }
};

module.exports = remove;
