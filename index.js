const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const port = process.env.PORT || 21239;
const server = express();

server.listen(port, () => console.log(` == server listening on port ${port} == `));
