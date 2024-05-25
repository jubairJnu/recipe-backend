const { Schema, model } = require("mongoose");

// Define a schema for the recipe
const recipeSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  creatorEmail: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  purchased_by: {
    type: [String], // Assuming an array of strings for the purchased_by field
    default: [],
  },
  watchCount: {
    type: Number,
    default: 0,
  },
  youtube: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
});

// Create a Mongoose model based on the schema
const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
