const express = require("express");
const db = require("../config/db");

const router = express.Router();

// GET /api/activities?limit=25 — recent activity history (always the full
// durable record, regardless of what's been cleared from the dashboard screen)
router.get("/", async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 25, 200);
        const result = await db.execute({
            sql: "SELECT * FROM activities ORDER BY created_at DESC LIMIT ?",
            args: [limit],
        });
        res.json(result.rows);
    } catch (err) {
        console.error("Failed to fetch activities:", err);
        res.status(500).json({ error: "Failed to fetch activities" });
    }
});

// POST /api/activities — log a new event (used for zone-enter/zone-exit
// events, which are only detectable client-side from marker geometry;
// registration and removal are logged automatically by routes/tourists.js)
router.post("/", async (req, res) => {
    try {
        const { tourist_id, tourist_name, activity_type, description } = req.body;

        if (!activity_type || !description) {
            return res.status(400).json({ error: "activity_type and description are required" });
        }

        const result = await db.execute({
            sql: `INSERT INTO activities (tourist_id, tourist_name, activity_type, description)
                  VALUES (?, ?, ?, ?)`,
            args: [tourist_id || null, tourist_name || null, activity_type, description],
        });

        res.status(201).json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (err) {
        console.error("Failed to log activity:", err);
        res.status(500).json({ error: "Failed to log activity" });
    }
});

// Note: no DELETE route here on purpose. The dashboard's "clear" button only
// clears the on-screen list (see dashboard.html) — it never calls this API,
// so the activities table keeps a permanent record.

module.exports = router;