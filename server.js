const mongoose = require("mongoose");
const app = require("./app");

const { DB_HOST, HOST = 5658 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(HOST);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
