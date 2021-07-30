const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
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
  other_names: {
    type: String,
  },
  country: {
    name: {
      type: String,
      require: true,
    },
    abbr: {
      type: String,
      require: true,
    },
  },
  document: {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
  },
  seq: {
    type: Number,
    default: 0,
  },
});

module.exports = model("User", UserSchema);
