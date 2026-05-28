import { getDashboardMetrics } from '../services/analytics.service.js';

export const dashboard = async (_req, res, next) => {
  try { res.json(await getDashboardMetrics()); } catch (error) { next(error); }
};
