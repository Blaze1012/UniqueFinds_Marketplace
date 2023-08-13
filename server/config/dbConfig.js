const db = require("mongoose");
db.connect(process.env.mongo_url);

db.connection.on("connected", () => {
  console.log("Mongo DB Connected");
});

db.connection.on("error", (err) => {
  console.log("Mongo DB connection failed with error", err);
});

module.exports = db;
