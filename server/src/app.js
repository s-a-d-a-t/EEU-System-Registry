const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const prisma = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const tagRoutes = require("./routes/tagRoutes");

const app = express();

// Middleware
app.use(helmet()); // secure HTTP headers
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tags", tagRoutes);


// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API is running."
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});

// Global error handler
app.use((error, req, res, next) => {

    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal server error."
    });

});

module.exports = app;