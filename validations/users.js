const { check } = require("express-validator");

const validations = [
  check("country")
    .isObject()
    .withMessage("El país no es un tipo válido")
    .custom((country) => {
      const { name, abbr } = country;
      if (!name || !abbr) {
        return false;
      }
      return !(abbr !== "co" && abbr !== "us");
    })
    .withMessage("El país no es válido"),
  check("other_names")
    .custom((name) => {
      if (name) {
        const regex = /(?=^[^\s]+(\s+[^\s]+)*$)(?=^[A-Z \s]+$)(?=^.{1,50}$)/;
        return regex.test(name);
      }
      return true;
    })
    .withMessage(
      "El campo de otros nombres debe ser de la A a la Z, en mayúsculas y con espacios entre las letras."
    ),
  check("lastname")
    .not()
    .isEmpty()
    .withMessage("El primer apellido es requerido.")
    .matches(/(?=^[^\s]+(\s+[^\s]+)*$)(?=^[A-Z \s]+$)(?=^.{1,20}$)/)
    .withMessage(
      "El primer apellido solo admite hasta 20 carácteres de la A a la Z, en mayúscula. "
    ),
  check("firstname")
    .not()
    .isEmpty()
    .withMessage("El primer nombre es requerido.")
    .matches(/(?=^[A-Z \s]+$)(?=^.{1,20}$)/)
    .withMessage(
      "El primer nombre solo admite hasta 20 carácteres de la A a la Z, en mayúscula. "
    ),
  check("second_surname")
    .not()
    .isEmpty()
    .withMessage("El segundo apellido es requerido.")
    .matches(/(?=^[A-Z \s]+$)(?=^.{1,20}$)/)
    .withMessage(
      "El segundo apellido solo admite hasta 20 carácteres de la A a la Z, en mayúscula. "
    ),
  check("document")
    .not()
    .isEmpty()
    .withMessage("El document es requerido")
    .custom((document) => {
      const { name, number } = document;
      if (!name || !number) {
        return false;
      }
      const regex = /(?=^[a-zA-Z0-9-]+$)(?=^.{1,20}$)/;
      return regex.test(number);
    })
    .withMessage("Documento no válido"),
];

module.exports = validations;
