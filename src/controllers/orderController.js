// controllers/orderController.js
import Order from '../models/Order.js';
import User  from '../models/User.js';

// 1. Create order (customer)
export const createOrder = async (req, res) => {
  try {
    const { items, subtotal, shipping, tax, total, address } = req.body;
    const user = await User.findById(req.user._id);

    const order = await Order.create({
      userId: user._id,
      customerInfo: {
        name:  user.name,
        email: user.email,
        phone: user.phone || ''
      },
      address,
      items,
      subtotal,
      shipping,
      tax,
      total
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create order' });
  }
};

// 2. Get own orders (customer)
export const getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// 3. Get single order (customer/admin/rider)
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('rider', 'name email')
    .populate('userId','name email');
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const isOwner = order.userId._id.equals(req.user._id);
  const isAssignedRider = order.rider?.equals(req.user._id);
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAssignedRider && !isAdmin)
    return res.status(403).json({ error: 'Access denied' });

  res.json(order);
};

// 4. Get all orders (admin)
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('rider', 'name email')
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// 5. Ship an order (admin only)
export const shipOrder = async (req, res) => {
  const { riderId } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'Paid')
    return res.status(400).json({ error: 'Only Paid orders can be shipped' });

  // ensure rider exists and has rider role
  const rider = await User.findById(riderId);
  if (!rider || rider.role !== 'rider')
    return res.status(400).json({ error: 'Invalid rider' });

  order.status = 'Shipped';
  order.rider  = riderId;
  await order.save();

  res.json(order);
};

// 6. Get orders assigned to a rider
export const getRiderOrders = async (req, res) => {
  const orders = await Order.find({ rider: req.user._id })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// 7. Rider updates delivery status
export const updateDeliveryStatus = async (req, res) => {
  const { status } = req.body; // expect "Delivered" or "Undelivered"
  if (!['Delivered','Undelivered'].includes(status))
    return res.status(400).json({ error: 'Invalid status' });

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (!order.rider?.equals(req.user._id))
    return res.status(403).json({ error: 'Not your assigned order' });
  if (order.status !== 'Shipped')
    return res.status(400).json({ error: 'Can only update Shipped orders' });

  order.status = status;
  await order.save();
  res.json(order);
};
