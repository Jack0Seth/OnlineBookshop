const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Book = require('../models/Book');

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.book');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'No items in cart' });
    }

    // Calculate prices
    const itemsPrice = cart.items.reduce(
      (sum, item) => sum + (item.book.price * item.quantity),
      0
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Create order
    const order = new Order({
      user: req.user.id,
      items: cart.items.map(item => ({
        book: item.book._id,
        quantity: item.quantity,
        price: item.book.price
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });

    // Save order
    const createdOrder = await order.save();

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [] } }
    );

    // Update book stock
    for (const item of cart.items) {
      await Book.findByIdAndUpdate(item.book._id, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json(createdOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const order = await Order.findById(req.params.id).populate('items.book');

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error in GET /api/orders:', err);
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.status(500).send('Server error');
  }
});

// Get logged in user orders
router.get('/', auth, async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const orders = await Order.find({ user: req.user.id }).populate('items.book');
    //.populate('items.book') removed at the end above
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;