import Payment from '../models/Payment.js';

export const getPayments = async (req, res, next) => {
  try {
    const { status, method, start, end } = req.query;
    const query = {};
    if (status) query.status = status;
    if (method) query.method = method;
    if (start || end) query.createdAt = { ...(start ? { $gte: new Date(start) } : {}), ...(end ? { $lte: new Date(end) } : {}) };
    const payments = await Payment.find(query).sort({ createdAt: -1 }).populate('client', 'name email').populate('service', 'name').populate({ path: 'barber', populate: { path: 'user', select: 'name' } });
    res.json(payments);
  } catch (error) { next(error); }
};

export const createPayment = async (req, res, next) => {
  try {
    const subtotal = req.body.items.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
    const tax = Math.round(subtotal * 0.19);
    const payment = await Payment.create({ ...req.body, subtotal, tax, total: subtotal + tax });
    res.status(201).json(payment);
  } catch (error) { next(error); }
};
