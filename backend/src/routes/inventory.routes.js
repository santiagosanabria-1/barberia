import { Router } from 'express';
import Inventory from '../models/Inventory.js';
import { crudController } from '../controllers/crud.controller.js';
import { createInventory, listInventory } from '../controllers/inventory.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();
const inventory = crudController(Inventory, { populate: 'product createdBy' });
router.use(protect, authorize('admin'));
router.get('/', listInventory);
router.post('/', createInventory);
router.put('/:id', inventory.update);
router.delete('/:id', inventory.remove);
export default router;
