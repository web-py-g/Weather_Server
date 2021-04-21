require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');
const {router, repo} = require("./routes/router");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(router);

const server = app.listen(port, async (err, req, res, next) => {
  await repo.connect();

  if (err) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
    return;
  }

  console.log("Server is listening on port:" + port);
});