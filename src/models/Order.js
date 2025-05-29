// models/Order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id:          { type: String, required: true },
  productId:   { type: String, required: true },
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  color:       { type: String },
  size:        { type: String },
  quantity:    { type: Number, required: true },
  image:       { type: String }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  street:     String,
  city:       String,
  state:      String,
  postalCode: String,
  country:    String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerInfo: {
    name:  { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
  },
  address:      addressSchema,
  items:        [orderItemSchema],
  subtotal:     { type: Number, required: true },
  shipping:     { type: Number, required: true },
  tax:          { type: Number, required: true },
  total:        { type: Number, required: true },
  status: {
    type: String,
    enum: ['Paid','Shipped','Delivered','Undelivered'],
    default: 'Paid'
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   // riders are stored in User collection with role="rider"
  },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
