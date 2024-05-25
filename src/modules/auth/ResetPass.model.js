const { Schema, model } = require("mongoose");

const ResetPasswordSchema = new Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  expiration: { type: Date, required: true },
});

ResetPasswordSchema.index({ expiration: 1 }, { expireAfterSeconds: 0 }); // TTL index

const ResetPassword = model("ResetPassword", ResetPasswordSchema);

module.exports = ResetPassword;
