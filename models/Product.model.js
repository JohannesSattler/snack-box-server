const { Schema, model } = require("mongoose");

const productSchema = new Schema(
{
    name: String,
    brand: String,
    image: String,
    price: Number,
    palmOil: String,
    vegan: String,
    vegetarian: String,
    sweet: Boolean,
    salty: Boolean,
    organic: Boolean,
    fat: String,
    salt: String,
    saturatedFat: String,
    sugars: String,
    ingredients: String,
    nutriScore: String,
    nutrtionTable: {
        energy: Number,
        energyUnit: String,
        fat: Number,
        fatUnit: String,
        salt: Number,
        saltUnit: String,
        sugars: Number,
        sugarsUnit: String,
        proteins: Number,
        proteinsUnit: String,
        carbohydrates: Number,
        carbohydratesUnit: String,
        calcium: Number,
        calciumUnit: String,
        fiber: Number,
        fiberUnit: String,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Product = model("products", productSchema);

module.exports = Product;