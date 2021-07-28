const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  last_name: {
    type: String,
    require: true,
  },
  second_surname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

module.exports = model("User", UserSchema);
