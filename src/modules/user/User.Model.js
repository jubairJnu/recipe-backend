const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  displayName: { type: String },
  photoURL: { type: String },
  blood: { type: String },
  email: { type: String },
  coin: { type: Number },
});

const User = model("User", userSchema);

module.exports = User;
