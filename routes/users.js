// api/users

const { Router } = require("express");

const { userValidators } = require("../validations");

const { validate } = require("../middlewares");

const { create } = require("../controllers/users");

const router = Router();

const middlewares = [...userValidators, validate];

router.post("/create", middlewares, create);

module.exports = router;
