const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./config/db");


const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");


dotenv.config();


const app = express();
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(cors());
app.use(express.json());

//creates endpoint
app.use("/api/auth",authRoutes);
app.use("/api/applications", applicationRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("API running");
});

app.get("/users", async(req,res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

module.exports = app;