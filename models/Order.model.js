const { Schema, model } = require("mongoose");


const ordersSchema = new Schema(
  {
    isActive: Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions'
    },
    status: {
        packBox: {
          date: Date,
          additionalInfo: String,
          current: Boolean
        },
        orderOnWay: {
          date: Date,
          additionalInfo: String,
          current: Boolean,
          trackingLink: String
        },
        arrived: {
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