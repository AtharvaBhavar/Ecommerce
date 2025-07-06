import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [Product]
    });

    const items = cartItems.map(item => ({
      id: item.Product.id,
      name: item.Product.name,
      price: parseFloat(item.Product.price),
      image: item.Product.image,
      category: item.Product.category,
      quantity: item.quantity,
      stock: item.Product.stock
    }));

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({ items, total, itemCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const existingCartItem = await Cart.findOne({
      where: { userId: req.user.id, productId }
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      
      await existingCartItem.update({ quantity: newQuantity });
    } else {
      await Cart.create({
        userId: req.user.id,
        productId,
        quantity
      });
    }

    res.json({ message: 'Product added to cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity <= 0) {
      await Cart.destroy({
        where: { userId: req.user.id, productId }
      });
      return res.json({ message: 'Item removed from cart' });
    }

    const product = await Product.findByPk(productId);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    await Cart.update(
      { quantity },
      { where: { userId: req.user.id, productId } }
    );

    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove from cart
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
  try {
    await Cart.destroy({
      where: { userId: req.user.id, productId: req.params.productId }
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    await Cart.destroy({
      where: { userId: req.user.id }
    });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;