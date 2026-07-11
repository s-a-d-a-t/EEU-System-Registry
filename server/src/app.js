const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("API running");
});

app.get("/users", async(req,res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

module.exports = app;