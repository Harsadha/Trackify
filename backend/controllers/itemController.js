const Item = require("../models/Item");

// CREATE ITEM (WITH IMAGE)
exports.createItem = async (req, res) => {
  try {
    // 🔍 DEBUG (very important)
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    // ❌ If no body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "No data received in body" });
    }

    // ❌ If user not present
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    const item = await Item.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      type: req.body.type,
      image: req.file ? req.file.path : null,
      UserId: req.user.id
    });

    res.status(201).json(item);

  } catch (err) {
    console.error("CREATE ITEM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL ITEMS
exports.getItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET MY ITEMS
exports.getMyItems = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    const items = await Item.findAll({
      where: { UserId: req.user.id }
    });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    item.status = req.body.status;
    await item.save();

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
