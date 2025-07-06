import { sequelize } from '../config/database.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const seedData = async () => {
  try {
    // Create admin user
    await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password',
        role: 'admin'
      }
    });

    // Create test user
    await User.findOrCreate({
      where: { email: 'john@example.com' },
      defaults: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role: 'user'
      }
    });

    // Create sample products
    const products = [
      {
        name: 'Premium Wireless Headphones',
        description: 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.',
        price: 299.99,
        originalPrice: 399.99,
        category: 'Electronics',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
        images: [
          'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
          'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500'
        ],
        stock: 25,
        rating: 4.8,
        reviews: 127,
        features: ['Active Noise Cancellation', '30-hour battery', 'Quick charge', 'Bluetooth 5.0'],
        specifications: {
          'Driver Size': '40mm',
          'Frequency Response': '20Hz - 20kHz',
          'Impedance': '32 ohms',
          'Weight': '250g'
        },
        isNew: true,
        isFeatured: true
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and water resistance.',
        price: 199.99,
        category: 'Electronics',
        image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=500',
        images: ['https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=500'],
        stock: 15,
        rating: 4.6,
        reviews: 89,
        features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', 'Sleep Tracking'],
        specifications: {
          'Display': '1.4 inch AMOLED',
          'Battery': '7 days',
          'Water Rating': '5ATM',
          'Sensors': 'Heart Rate, GPS, Accelerometer'
        },
        isFeatured: true
      },
      {
        name: 'Organic Cotton T-Shirt',
        description: 'Comfortable and sustainable organic cotton t-shirt perfect for everyday wear. Made from 100% certified organic cotton.',
        price: 29.99,
        category: 'Clothing',
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500',
        images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500'],
        stock: 50,
        rating: 4.4,
        reviews: 203,
        features: ['100% Organic Cotton', 'Machine Washable', 'Pre-shrunk', 'Tagless'],
        specifications: {
          'Material': '100% Organic Cotton',
          'Fit': 'Regular',
          'Care': 'Machine wash cold',
          'Origin': 'USA'
        }
      }
    ];

    for (const productData of products) {
      await Product.findOrCreate({
        where: { name: productData.name },
        defaults: productData
      });
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

export default seedData;