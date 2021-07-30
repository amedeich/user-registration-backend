/** @type {import("express").RequestHandler} */

const mongoose = require("mongoose");

const User = require("../models/User");

const beginCreateUser = async (req, res) => {
  const { firstname, lastname, document } = req.body;

  const { abbr: region } = req.body.country;

  const doesUserExists = await User.findOne({
    document,
  });

  if (doesUserExists) {
    return res.status(409).json({
      msg: `Ya existe un usuario con el número de identificación: ${document.number} y el tipo de documento: ${document.name}`,
      ok: false,
    });
  }

  const generatedMail = `${firstname}.${lastname.replace(
    /\s/g,
    ""
  )}@cidenet.com.${region}`;

  req.body = { ...req.body, email: generatedMail.toLowerCase() };

  const session = await mongoose.startSession();

  try {
    session.withTransaction(async (_) => {
      const sequence = await incrementSequenceInUser(req.body, session);

      if (sequence) {
        const user = { ...req.body, seq: sequence };
        return createUserWithSequence(session, user, res);
      }

      await session.commitTransaction();

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

const incrementSequenceInUser = async (body, session) => {
  const { email } = body;
  const user = await User.findOneAndUpdate(
    {
      email: { $regex: email.substr(0, email.lastIndexOf(".")), $options: "i" },
    },
    { $inc: { seq: 1 } },
    { new: true, session }
  );
  return user?.seq;
};

const createUserWithSequence = async (
  session,
  updatedUserWithSequence,
  response
) => {
  const { email, seq } = updatedUserWithSequence;
  let [mail, domain] = email.split("@");
  mail += `.${seq}`;
  const updatedMail = `${mail}@${domain}`;
  return createUserHandler(
    { ...updatedUserWithSequence, email: updatedMail },
    response,
    session
  );
};

const createUserHandler = async (body, response, session) => {
  try {
    const userModel = new User(body);
    await userModel.save({ session });
    if (session) {
      await session.commitTransaction();
    }
    response.status(201).json({
      ...userModel.toObject(),
      ok: true,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    response.status(400).json({
      error,
      ok: false,
    });
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

module.exports = beginCreateUser;
