const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Item = sequelize.define("Item", {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  location: DataTypes.STRING,
  type: DataTypes.STRING,
  status: { type: DataTypes.STRING, defaultValue: "lost" },
  image: DataTypes.STRING 
});

module.exports = Item;