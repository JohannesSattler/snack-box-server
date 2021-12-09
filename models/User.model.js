const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    password: String,
    isVerified: Boolean,
    signupStage: Number,
    adressInfo: {
      city: String,
      postalCode: String,
      street: String,
      houseNumber: String,
      additionalInfo: String,
    },
    snackInfo: {
      perDay: String,
      amountPeople: Number,
      sweet: Boolean,
      salty: Boolean,
      organic: Boolean,
      vegan: Boolean,
      vegetarian: Boolean,
    },
    paymentInfo: {
      paypal: Boolean,
      stripe: Boolean,
    },
    subscriptions: []
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
