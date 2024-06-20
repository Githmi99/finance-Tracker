const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
