require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require("./routes/auth");
const products = require("./routes/productRoutes");
const errorHandler = require("./middlewares/errorMiddleware");


// MongoDB Connection
const mongoURI = process.env.MONGO_URI + "&ssl=true&tls=true&tlsInsecure=true";

// Middleware to parse JSON
app.use(express.json());

// Sample Route
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/products", products);

// Global Error Handler
app.use(errorHandler);

// Error Handling Middleware (Logs Errors)
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message || err });
});

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected Successfully!"))
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err.message);
  process.exit(1);  // Stop the server if DB connection fails
});


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
