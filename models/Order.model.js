const { Schema, model } = require("mongoose");


const ordersSchema = new Schema(
  {
    status: {
        packBox: {
          label: String,
          date: String,
          additionalInfo: String,
          current: Boolean
        },
        orderOnWay: {
          label: String,
          date: String,
          additionalInfo: String,
          current: Boolean,
          trackingLink: String
        },
        arrived: {
          label: String,
          date: String,
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