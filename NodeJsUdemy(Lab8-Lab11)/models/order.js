const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Lab14.3
const orderSchema = new Schema({
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    name: { type: String },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
