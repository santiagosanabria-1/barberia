import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';

export const listInventory = async (_req, res, next) => {
  try { res.json(await Inventory.find().sort({ createdAt: -1 }).populate('product').populate('createdBy', 'name')); } catch (error) { next(error); }
};

export const createInventory = async (req, res, next) => {
  try {
    const movement = await Inventory.create({ ...req.body, createdBy: req.user._id });
    const delta = req.body.type === 'salida' ? -Math.abs(req.body.quantity) : Math.abs(req.body.quantity);
    await Product.findByIdAndUpdate(req.body.product, { $inc: { stock: delta } });
    res.status(201).json(await movement.populate('product'));
  } catch (error) { next(error); }
};
