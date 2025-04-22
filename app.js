const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
app.use("/api/expenses", require("./routes/expenses"));

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to Expense Tracker API");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
