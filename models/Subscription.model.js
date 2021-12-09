const { Schema, model } = require("mongoose");


const subscriptionSchema = new Schema(
  {
    title: String,
    description: String,
    image: String,
    total: Number,
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'products'
    }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Subscription = model("subscriptions", subscriptionSchema);

module.exports = Subscription;