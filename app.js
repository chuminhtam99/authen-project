require("dotenv").config();
const mongooseDBConnection = require("./database/db.js");
const authRoutes = require("./routes/auth-routes.js");
const homeRoutes = require("./routes/home-routes.js");
const adminRoutes = require("./routes/admin-routes.js");
const imageRoutes = require("./routes/image-routes.js");

const express = require("express");
const app = express();

mongooseDBConnection();

app.use(express.json());

app.use("/api/user", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", imageRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server in port : ", PORT);
});

