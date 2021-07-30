// api/users

const { Router } = require("express");

const { userValidators } = require("../validations");

const { validate, query } = require("../middlewares");

const { create, get, remove } = require("../controllers/users");

const router = Router();

const middlewares = [...userValidators, validate];

router.get("/", query, get);

router.post("/create", middlewares, create);

router.delete("/:id", remove);

module.exports = router;
