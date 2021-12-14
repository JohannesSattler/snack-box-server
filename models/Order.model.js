const { Schema, model } = require("mongoose");


const ordersSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions'
    },
    status: {
        orderReceived: {
          label: String,
          date: Date,
          additionalInfo: String,
          current: Boolean
        },
        packBox: {
          label: String,
          date: Date,
          additionalInfo: String,
          current: Boolean
        },
        orderOnWay: {
          label: String,
          date: Date,
          additionalInfo: String,
          current: Boolean,
          trackingLink: String
        },
        arrived: {
          label: String,
          date: Date,
          additionalInfo: String,
          current: Boolean
        }
      }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Orders = model("orders", ordersSchema);

module.exports = Orders;