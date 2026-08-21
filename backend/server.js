const express = require("express");
const path = require("path");

const touristsRouter = require("./routes/tourists");
const activitiesRouter = require("./routes/activities");
const riskZonesRouter = require("./routes/riskZones");

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api/tourists", touristsRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/risk-zones", riskZonesRouter);

// Landing Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


// Dashboard Page
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});