const Items = require('../models/item.model').model;
const User = require('../models/user.model').model;
const ioController =require('../controllers/IOController.js');

const allitems =async (req, res) => {
   try {
       const allitems = await Items.find().where("statut").in([false]);
       //const allitems = await Items.find();
       res.status(200).json(allitems);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};

const createitems = async (req, res, _) => {
  const newItemData = { ...req.body };
  console.log("req.userId:",req.userId);
  try {
    newItemData["userId"] = req.userId;
    const item = await Items.create(newItemData);

    res.status(200).json(item);
  } catch (error) {
    res.status(400).json(error);
  }
};

const borrowItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const user = await User.findById(req.userId);
    if (user.ItemsEmprunté.length >= 2) {
      res.status(400).json({ error: 'You can only borrow up to 2 items' });
      return;
    }
    const updatedItem = await Items.findByIdAndUpdate(itemId, {
      statut: true,
      userId: user
    }, { new: true });
    if (!updatedItem) {
      throw new Error('Item not found');
    }
    user.ItemsEmprunté.push(updatedItem._id);
    await user.save();
    res.status(200).json(updatedItem);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getItemsOfOther = async (req, res) => {
  const items = await Items.find().where("statut").in([true]).populate('userId');
  console.log(items);
  const itemsWithUserName = items.map(item => {
    return {
      description: item.description,
      userName: item.userId.name
    }
  });
  res.status(200).json(itemsWithUserName);
}

const releaseItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const user = await User.findById(req.userId);
    const updatedItem = await Items.findByIdAndUpdate(itemId, {
      statut: false,
      userId: null
    }, { new: true });

    if (!updatedItem) {
      res.status(404).json({ error: 'Item not found' });
    }

    user.ItemsEmprunté.pull(updatedItem._id);
    await user.save();

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteitems = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Items.findById(itemId);
    const user = await User.findById(req.userId);
    if (!item.userId) {
      await Items.findByIdAndDelete(itemId);
      res.status(204).send();
      return;
    }
    if (!(item.userId == req.userId)) {
      res.status(403).json({ error: 'You can only delete objects that you have added' });
      return;
    }
    if (item.statut) {
      throw new Error('This item is currently on loan and cannot be deleted');
    }
    await Items.findByIdAndDelete(itemId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateItemDescription = async (req, res) => {
  const { itemId, newDescription } = req.body;
  try {
    const item = await Items.findById(itemId);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    item.description = newDescription;
    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json(error);
  }
};


module.exports.allitems = allitems;
module.exports.createitems = createitems;
module.exports.deleteitems = deleteitems;
module.exports.borrowItem = borrowItem;
module.exports.releaseItem = releaseItem;
module.exports.getItemsOfOther = getItemsOfOther;
module.exports.updateItemDescription = updateItemDescription;
