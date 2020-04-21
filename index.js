const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const port = process.env.PORT || 21239;
const db = require("./data/model.js");
const server = express();

server.use(express.json());

server.post("/api/register", checkCredentialsObject, (req, res) => {
  const user = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
  };
  db("users")
    .insert(user, "id")
    .then((ids) => {
      db("users")
        .select()
        .where({ id: ids[0] })
        .first()
        .then((user) => {
          res.status(200).json(user);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "failed to insert new user" });
    });
});

function checkCredentialsObject(req, res, next) {
  if (req.body.password === undefined || req.body.username === undefined) {
    res.status(400).json({ message: "username and password required" });
    return;
  }
  next();
}

server.listen(port, () =>
  console.log(` == server listening on port ${port} == `)
);
