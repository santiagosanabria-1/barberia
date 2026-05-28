export const productValidator = (body) => {
  if (!body.name) return 'Product name is required';
  if (!body.sku) return 'SKU is required';
  if (!body.category) return 'Category is required';
  if (Number(body.price) < 0) return 'Price must be valid';
  return true;
};
