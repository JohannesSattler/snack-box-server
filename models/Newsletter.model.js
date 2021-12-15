const { Schema, model } = require("mongoose");


const newsletterSchema = new Schema(
  {
    name: String,
    email: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Newsletter = model("newsletter", newsletterSchema);

module.exports = Newsletter;