import Settings from '../models/Settings.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (error) { next(error); }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (error) { next(error); }
};