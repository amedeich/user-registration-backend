const express = require("express");
const dbConnection = require("./db");

require("dotenv").config();

const { APP_PORT } = process.env;

const app = express();

app.use(express.json());

app.use("/api/v1/users", require("./routes/users"));

app.get("*", (_, res) =>
  res.status(400).send({ ok: false, msg: "Route not found" })
);

dbConnection()
  .then((_) =>
    app.listen(APP_PORT, () => {
      console.log("App is running at port: ", APP_PORT);
    })
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
