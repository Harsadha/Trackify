//controllers>itemController.js

const Item = require("../models/Item");
const { User } = require("../models");
const { Op } = require("sequelize");

// CREATE ITEM
exports.createItem = async (req, res) =>
{
  try
  {
    const { title, description, category, location, type } = req.body;

    if (!title || !category || !type)
      return res.status(400).json({ msg: "Missing required fields" });

    const item = await Item.create({
      title,
      description,
      category,
      location,
      type,
      image: req.file ? req.file.path : null,
      UserId: req.user.id
    });

    res.status(201).json(item);

  }
  catch (err)
  {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL ITEMS (WITH FILTERS + USER)
exports.getItems = async (req, res) =>
{
  try
  {
    const { search, type, category, status } = req.query;

    let where = {};

    if (type) where.type = type;
    if (category) where.category = category;
    if (status) where.status = status;

    if (search)
    {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const items = await Item.findAll({
      where,
      include: [{ model: User, attributes: ["name"] }]
    });

    res.json(items);

  }
  catch (err)
  {
    res.status(500).json({ error: err.message });
  }
};

// GET ITEM BY ID
exports.getItemById = async (req, res) =>
{
  try
  {
    const item = await Item.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["name"] }]
    });

    if (!item)
      return res.status(404).json({ msg: "Item not found" });

    res.json(item);

  }
  catch (err)
  {
    res.status(500).json({ error: err.message });
  }
};

// GET MY ITEMS
exports.getMyItems = async (req, res) =>
{
  try
  {
    const items = await Item.findAll({
      where: { UserId: req.user.id }
    });

    res.json(items);

  }
  catch (err)
  {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) =>
{
  try
  {
    const item = await Item.findByPk(req.params.id);

    if (!item)
      return res.status(404).json({ msg: "Item not found" });

    if (item.UserId !== req.user.id)
      return res.status(403).json({ msg: "Not allowed" });

    item.status = req.body.status;
    await item.save();

    res.json(item);

  }
  catch (err)
  {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ITEM
exports.deleteItem = async (req, res) =>
{
  try
  {
    const item = await Item.findByPk(req.params.id);

    if (!item)
      return res.status(404).json({ msg: "Item not found" });

    if (item.UserId !== req.user.id)
      return res.status(403).json({ msg: "Not allowed" });

    await item.destroy();

    res.json({ msg: "Item deleted" });

  }
  catch (err)
  {
    res.status(500).json({ error: err.message });
  }
};


exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: { model: User, attributes: ["id", "name"] }
    });

    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};