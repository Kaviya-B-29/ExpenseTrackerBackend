const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // 🔽 Finance fields (NEW)
    income: {
      type: Number,
      default: 0,
      min: 0,
    },
    budget: {
      amount: {
        type: Number,
        default: null, // user must set
      },
      period: {
        type: String,
        enum: ["weekly", "monthly", "always"],
        default: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
