const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid expense ID",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// @desc    Add expense
// @route   POST /api/expenses
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    // Simple validation
    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        error: "Please provide title, amount and category",
      });
    }

    const expense = await Expense.create(req.body);

    return res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Public
router.put("/:id", async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: "Expense not found",
      });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid expense ID",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: "Expense not found",
      });
    }

    await expense.deleteOne();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid expense ID",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// @desc    Get expenses by category
// @route   GET /api/expenses/category/:categoryName
// @access  Public
router.get("/category/:categoryName", async (req, res) => {
  try {
    const expenses = await Expense.find({
      category: req.params.categoryName,
    }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;
