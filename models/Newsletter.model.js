const { Schema, model } = require("mongoose");


const newsletterSchema = new Schema(
  {
    email: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Subscription = model("Subscriptions", newsletterSchema);

module.exports = Subscription;