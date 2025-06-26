const express = require('express');
const { body, validationResult } = require('express-validator');
const Coupon = require('../models/Coupon');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all coupons
router.get('/', auth, async (req, res) => {
  try {
    const coupons = await Coupon.find({})
      .sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search coupons
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const coupons = await Coupon.find({
      $text: { $search: q }
    }).sort({ score: { $meta: 'textScore' } });

    res.json(coupons);
  } catch (error) {
    console.error('Search coupons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get coupon by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      _id: req.params.id
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json(coupon);
  } catch (error) {
    console.error('Get coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new coupon
router.post('/', [
  auth,
  body('code').trim().isLength({ min: 1 }).withMessage('Coupon code is required'),
  body('discountValue').isFloat({ min: 0 }).withMessage('Invalid discount value'),
  body('validFrom').isISO8601().withMessage('Invalid valid from date'),
  body('validUntil').isISO8601().withMessage('Invalid valid until date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      code,
      discountValue,
      minimumPurchase,
      validFrom,
      validUntil,
      usageLimit
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code,
      description: `Coupon ${code}`, // Generate a default description
      discountValue,
      minimumPurchase: minimumPurchase || 0,
      validFrom,
      validUntil,
      usageLimit: usageLimit || -1,
      createdBy: req.user._id
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update coupon
router.put('/:id', [
  auth,
  body('code').trim().isLength({ min: 1 }).withMessage('Coupon code is required'),
  body('discountValue').isFloat({ min: 0 }).withMessage('Invalid discount value'),
  body('validFrom').isISO8601().withMessage('Invalid valid from date'),
  body('validUntil').isISO8601().withMessage('Invalid valid until date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const coupon = await Coupon.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    const {
      code,
      discountValue,
      minimumPurchase,
      validFrom,
      validUntil,
      usageLimit,
      isActive
    } = req.body;

    // Check if coupon code already exists (excluding current coupon)
    const existingCoupon = await Coupon.findOne({ 
      code, 
      _id: { $ne: req.params.id } 
    });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    // Update coupon
    coupon.code = code;
    coupon.discountValue = discountValue;
    coupon.minimumPurchase = minimumPurchase || 0;
    coupon.validFrom = validFrom;
    coupon.validUntil = validUntil;
    coupon.usageLimit = usageLimit || -1;
    if (typeof isActive === 'boolean') {
      coupon.isActive = isActive;
    }

    await coupon.save();
    res.json(coupon);
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete coupon
router.delete('/:id', auth, async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 