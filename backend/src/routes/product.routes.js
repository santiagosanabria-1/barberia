import { Router } from 'express';
import Product from '../models/Product.js';
import { crudController } from '../controllers/crud.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { productValidator } from '../validators/product.validator.js';

const router = Router();
const product = crudController(Product);
router.use(protect);
router.get('/', product.list);
router.post('/', authorize('admin'), validate(productValidator), product.create);
router.put('/:id', authorize('admin'), product.update);
router.delete('/:id', authorize('admin'), product.remove);
export default router;
