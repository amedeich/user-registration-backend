/** @type {import("express").RequestHandler} */

const queryHandler = (req, _, next) => {
  const { documentNumber, country, documentName } = req.query;

  let query = {};

  for (const key in req.query) {
    if (
      key === "firstname" ||
      key === "lastname" ||
      key === "other_names" ||
      key === "second_surname" ||
      key === "email"
    ) {
      if (req.query[key] === "") null;
      query = {
        ...query,
        [key]: { $regex: req.query[key], $options: "i" },
      };
    }
  }

  if (documentNumber) {
    query = {
      ...query,
      ...{ "document.number": { $regex: documentNumber, $options: "i" } },
    };
  }

  if (country) {
    query = {
      ...query,
      ...{ "country.abbr": { $regex: country, $options: "i" } },
    };
  }

  if (documentName) {
    query = {
      ...query,
      ...{ "document.slug": { $regex: documentName, $options: "i" } },
    };
  }

  req.mappedQuery = query;

  next();
};

module.exports = queryHandler;
