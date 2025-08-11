const mongoose = require("mongoose");
const mongooseDBConnection = async () => {
  try {
    await mongoose.connect(process.env.URI_DB_CONNECTION);
    console.log("db connection ok");
  } catch (error) {
    console.log("err -> ", error);
  }
};
module.exports = mongooseDBConnection;
