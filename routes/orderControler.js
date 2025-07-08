import { Order } from '../../models/Order';

const {
  createOrder,
  getUserOrders,
} = require('../controllers/orderController');

router.post('/api/user-orders', async (req, res) => {
  const { userId, orderDetails } = req.body;
  try {
    const order = await createOrder(userId, orderDetails);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating user order:', error);
    res.status(500).json({ error: 'Failed to create user order' });
  }
});

router.get('/api/user-orders', async (req, res) => {
  const { email } = req.query;
  try {
    const orders = await Order.find({ email });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

module.exports = router;
