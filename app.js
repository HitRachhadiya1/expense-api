const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); // Add this line to import the path module
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

// Production setup
if (process.env.NODE_ENV === "production") {
  // Serve frontend static files
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
} else {
  // Home route (for dev mode)
  app.get("/", (req, res) => {
    res.send("Welcome to Expense Tracker API");
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
