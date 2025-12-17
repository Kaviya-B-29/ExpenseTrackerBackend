const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

// helper to get date range
function getStartDate(period) {
  const now = new Date();

  if (period === "weekly") {
    now.setDate(now.getDate() - 7);
  } else if (period === "monthly") {
    now.setMonth(now.getMonth() - 1);
  } else {
    return null; // always
  }

  return now;
}

exports.getAnalytics = async (req, res) => {
  const { period = "monthly" } = req.query;
  const startDate = getStartDate(period);

  const filter = {
    user: req.user.id
  };

  if (startDate) {
    filter.date = { $gte: startDate };
  }

  const transactions = await Transaction.find(filter);
  const budget = await Budget.findOne({ user: req.user.id });

  // ---- Income & Expense ----
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    if (t.type === "expense") expense += t.amount;
  });

  // ---- Category-wise Expense ----
  const categoryMap = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
    });

  const categoryData = Object.entries(categoryMap).map(
    ([category, amount]) => ({ category, amount })
  );

  // ---- Daily Trend ----
  const trendMap = {};
  transactions.forEach(t => {
    const day = t.date.toISOString().split("T")[0];
    trendMap[day] = (trendMap[day] || 0) + t.amount;
  });

  const trend = Object.entries(trendMap).map(([date, amount]) => ({
    date,
    amount
  }));

  // ---- Budget Status ----
  let budgetStatus = null;
  if (budget) {
    budgetStatus = {
      budget: budget.amount,
      spent: expense,
      remaining: budget.amount - expense,
      overBudget: expense > budget.amount
    };
  }

  res.json({
    period,
    income,
    expense,
    savings: income - expense,
    categoryData,
    trend,
    budgetStatus
  });
};
