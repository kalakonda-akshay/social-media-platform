const dotenv = require("dotenv");
dotenv.config({ path: "./server/.env" });

const app = require("../server/src/app");
const connectDB = require("../server/src/config/db");

let connectionPromise;

module.exports = async (req, res) => {
  if (!connectionPromise) {
    connectionPromise = connectDB();
  }

  await connectionPromise;
  return app(req, res);
};
