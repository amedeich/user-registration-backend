/** @type {import("express").RequestHandler} */

const mongoose = require("mongoose");

const User = require("../models/User");

const updatedUserWithSequenceHandler = async (
  lastName,
  secondSurname,
  session
) => {
  const user = await User.findOneAndUpdate(
    { last_name: lastName, second_surname: secondSurname },
    { $inc: { seq: 1 } },
    { new: true, session }
  );
  return user;
};

const updatedUserHandler = async (
  session,
  updatedUserWithSequence,
  response
) => {
  const { _id, email, seq } = updatedUserWithSequence;
  let [mail, domain] = email.split("@");
  mail =
    seq > 1
      ? `${mail.substring(0, mail.lastIndexOf(".") + 1)}${seq}`
      : (mail += `.${seq}`);
  const updatedMail = `${mail}@${domain}`;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id },
      { email: updatedMail },
      { new: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return response.status(200).json({
      ...updatedUser._doc,
      ok: true,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return response.status(400).json({
      msg: "no se puede actualizar el usuario",
      error,
      ok: false,
    });
  }
};

const createUserHandler = async (body, response) => {
  try {
    const userModel = new User(body);
    await userModel.save();
    response.status(201).json({
      ...userModel.toObject(),
      ok: true,
    });
  } catch (error) {
    response.status(400).json({
      error,
      ok: false,
    });
  }
};

const beginCreateUser = async (req, res) => {
  let updatedUserWithSequence = undefined;

  const { last_name, second_surname } = req.body;

  const generatedMail = `${last_name}.${second_surname}@cidenet.es`;

  req.body = { ...req.body, email: generatedMail.toLowerCase() };

  const session = await mongoose.startSession();

  try {
    session.withTransaction(async (_) => {
      updatedUserWithSequence = await updatedUserWithSequenceHandler(
        last_name,
        second_surname,
        session
      );

      if (updatedUserWithSequence) {
        return updatedUserHandler(session, updatedUserWithSequence, res);
      }

      await session.commitTransaction();

      session.endSession();

      return createUserHandler(req.body, res);
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({
      error,
      ok: false,
    });
  }
};

module.exports = beginCreateUser;
