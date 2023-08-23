const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const dbConfig = require("./config/dbConfig");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const UsersRoute = require("./routes/usersRoute");
const ProductsRoute = require("./routes/productsRoute");
const BidsRoute = require("./routes/bidsRoute");
const NotificationsRoute = require("./routes/notificationsRoute");
const oauthRoute = require("./routes/oauthRoute");
const passport = require("passport");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
app.use(helmet());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(oauthRoute);
app.use("/api/users", UsersRoute);
app.use("/api/products", ProductsRoute);
app.use("/api/bids", BidsRoute);
app.use("/api/notifications", NotificationsRoute);

//deployment config
const path = require("path");

__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.get("/check", async (req, res) => {
  res.send({
    ServerStatus: "active",
  });
});

app.listen(port, () => {
  console.log(`NodeJS server started on ${port}`);
});
