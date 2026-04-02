const sequelize = require("../config/db");

const User = require("./User");
const Item = require("./Item");

// Relations
User.hasMany(Item);
Item.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Item,
};