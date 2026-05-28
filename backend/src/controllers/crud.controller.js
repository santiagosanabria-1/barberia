export const crudController = (Model, options = {}) => ({
  list: async (_req, res, next) => {
    try { res.json(await Model.find(options.query || {}).sort({ createdAt: -1 }).populate(options.populate || '')); } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try { res.status(201).json(await Model.create(req.body)); } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try { res.json(await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (error) { next(error); }
  },
  remove: async (req, res, next) => {
    try { res.json(await Model.findByIdAndDelete(req.params.id)); } catch (error) { next(error); }
  }
});
