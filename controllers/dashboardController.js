const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

exports.getDashboard = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id });
  const budget = await Budget.findOne({ user: req.user.id });

  const earnings = transactions
    .filter(t => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const spending = transactions
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const savings = earnings - spending;
  const overBudget = budget ? spending > budget.amount : false;

  res.json({
    earnings,
    spending,
    savings,
    budget: budget || null,
    overBudget
  });
};
