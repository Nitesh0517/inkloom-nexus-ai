const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firebaseUid: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['admin', 'compliance_officer', 'brand_manager', 'creator', 'reviewer'],
      default: 'brand_manager',
    },
    organization: {
      type: String,
      default: 'Acme Global Brands',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
