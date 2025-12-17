const Transaction = require("../models/Transaction");

// GET all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id, // ✅ FIX
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD transaction
exports.addTransaction = async (req, res) => {
  try {
    const { type, category, title, amount } = req.body;

    if (!type || !category || !title || !amount) {
  return res.status(400).json({ message: "All fields are required" });
}

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    const transaction = await Transaction.create({
      user: req.user.id, // ✅ CONSISTENT
      type,
      category,
      title: title.trim(),
      amount,
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error("Add transaction error:", err);
    res.status(500).json({ message: "Failed to add transaction" });
  }
};

// DELETE transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const txn = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id, // ✅ FIX
    });

    if (!txn) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await txn.deleteOne();
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
