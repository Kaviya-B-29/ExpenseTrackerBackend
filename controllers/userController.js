const User = require("../models/User");

// GET budget
exports.getBudget = async (req, res) => {
  const user = await User.findById(req.userId).select("budget");
  res.json(user.budget);
};

// SET / UPDATE budget
exports.setBudget = async (req, res) => {
  const { amount, period } = req.body;

  if (!amount || !period) {
    return res.status(400).json({ message: "Budget data missing" });
  }

  const user = await User.findById(req.userId);
  user.budget = { amount, period };
  await user.save();

  res.json(user.budget);
};
