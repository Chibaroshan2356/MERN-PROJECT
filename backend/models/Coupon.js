const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    required: [true, 'Coupon description is required'],
    trim: true
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  minimumPurchase: {
    type: Number,
    default: 0,
    min: [0, 'Minimum purchase cannot be negative']
  },
  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required']
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required']
  },
  usageLimit: {
    type: Number,
    default: -1, // -1 means unlimited
    min: [-1, 'Usage limit cannot be less than -1']
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
couponSchema.index({ 
  description: 'text', 
  code: 'text',
  category: 'text'
});

// Virtual for checking if coupon is valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         now >= this.validFrom && 
         now <= this.validUntil && 
         (this.usageLimit === -1 || this.usedCount < this.usageLimit);
});

// Method to check if coupon can be used
couponSchema.methods.canBeUsed = function() {
  return this.isValid;
};

// Method to increment usage
couponSchema.methods.incrementUsage = function() {
  if (this.usageLimit !== -1 && this.usedCount >= this.usageLimit) {
    throw new Error('Coupon usage limit exceeded');
  }
  this.usedCount += 1;
  return this.save();
};

module.exports = mongoose.model('Coupon', couponSchema); 