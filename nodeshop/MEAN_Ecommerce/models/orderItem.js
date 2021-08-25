const { Schema, model } = require("mongoose");

const orderItemSchems = Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },

  quantity: {
    type: Number,
    default: 0,
  },
});
module.exports = model("OrderItem", orderItemSchems);
