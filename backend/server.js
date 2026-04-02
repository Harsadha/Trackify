// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Import from models/index.js
const { sequelize } = require("./models");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/uploads", express.static("uploads"));

sequelize.sync({alter:true}).then(() => {
  console.log("Database synced");
  app.listen(5000, () => console.log("Server running on 5000"));
});