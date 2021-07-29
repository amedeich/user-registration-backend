/** @type {import("express").RequestHandler} */

const mongoose = require("mongoose");

const User = require("../models/User");

const updatedUserWithSequenceHandler = async (
  firstname,
  lastName,
  region,
  session
) => {
  const user = await User.findOneAndUpdate(
    {
      firstname: firstname,
      lastname: lastName,
      "country.abbr": { $in: [region] },
    },
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
  const { email, seq } = updatedUserWithSequence;
  let [mail, domain] = email.split("@");
  mail += `.${seq}`;
  const updatedMail = `${mail}@${domain}`;
  try {
    const { _id, _v, ...userWithNewEmail } = {
      ...updatedUserWithSequence.toObject(),
    };
    const newUser = new User({ ...userWithNewEmail, email: updatedMail });
    await newUser.save({ session });
    await session.commitTransaction();
    session.endSession();
    return response.status(200).json({
      ...newUser._doc,
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

  const { firstname, lastname } = req.body;

  const { abbr: region } = req.body.country;

  const generatedMail = `${firstname}.${lastname.replace(
    /\s/g,
    ""
  )}@cidenet.com.${region}`;

  req.body = { ...req.body, email: generatedMail.toLowerCase() };

  const session = await mongoose.startSession();

  try {
    session.withTransaction(async (_) => {
      updatedUserWithSequence = await updatedUserWithSequenceHandler(
        firstname,
        lastname,
        region,
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
