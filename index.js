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

server.post("/api/login", checkCredentialsObject, (req, res) => {
  db("users")
    .select()
    .where({ username: req.body.username })
    .first()
    .then((user) => {
      if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        res.status(401).json({ message: "You shall not pass!" });
        return;
      }
      res.status(200).json({ message: `welcome, ${user.username}` });
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
