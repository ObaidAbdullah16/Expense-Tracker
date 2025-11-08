// Simple Expense Tracker Server
// All code in one file for beginners!

const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = 3000;

// ========== DATABASE SETUP ==========
// Change these values to match your PostgreSQL setup
const pool = new Pool({
  user: "postgres", // Your PostgreSQL username
  host: "localhost", // Database location
  database: "expense_tracker", // Database name
  password: "Obaid@pst123", // Your PostgreSQL password (CHANGE THIS!)
  port: 5432, // PostgreSQL port
});

// Test database connection
pool.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed!");
    console.log("Error:", err.message);
  } else {
    console.log("✅ Database connected successfully!");
  }
});

// ========== MIDDLEWARE ==========
app.use(express.json()); // Parse JSON data
app.use(express.static(path.join(__dirname, "public"))); // Serve HTML/CSS/JS files

// ========== ROUTES ==========

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM expenses ORDER BY date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// Add new expense
app.post("/api/expenses", async (req, res) => {
  const { description, amount, category, date } = req.body;

  // Check if all fields are filled
  if (!description || !amount || !category || !date) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO expenses (description, amount, category, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [description, amount, category, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// Delete single expense by ID
app.delete("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM expenses WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

// Delete ALL expenses
app.delete("/api/expenses", async (req, res) => {
  try {
    await pool.query("DELETE FROM expenses");
    res.json({ message: "All expenses deleted successfully" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Failed to delete all expenses" });
  }
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("=================================");
});
