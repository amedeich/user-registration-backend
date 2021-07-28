const { check } = require("express-validator");

const validations = [
  check("last_name")
    .not()
    .isEmpty()
    .withMessage("El primer apellido es requerido.")
    .matches(/(?=^[A-Z]+$)(?=^.{1,20}$)/)
    .withMessage(
      "El primer apellido solo admite hasta 20 carácteres de la A a la Z, en mayúscula. "
    ),
  check("second_surname")
    .not()
    .isEmpty()
    .withMessage("El segundo apellido es requerido.")
    .matches(/(?=^[A-Z]+$)(?=^.{1,20}$)/)
    .withMessage(
      "El primer apellido solo admite hasta 20 carácteres de la A a la Z, en mayúscula. "
    ),
];

module.exports = validations;
