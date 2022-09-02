const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(
    process.env.MONGODB_CONNECT_URL,
    { useNewUrlParser: true },
    (err) => {
      if (err) {
        console.error("System could not connect to mongo server.");
        console.log(err);
      } else {
        console.log("System connected to mongo server.");
      }
    }
  );
};

module.exports = connectDB;
