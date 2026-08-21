const express = require("express");
const db = require("../config/db");

const router = express.Router();

// GET /api/tourists — all registered tourists, for populating the map on load
router.get("/", async (req, res) => {
    try {
        const result = await db.execute(
            "SELECT * FROM tourists ORDER BY registration_date DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Failed to fetch tourists:", err);
        res.status(500).json({ error: "Failed to fetch tourists" });
    }
});

// POST /api/tourists — register a new tourist
router.post("/", async (req, res) => {
    try {
        const {
            full_name,
            age,
            gender,
            phone,
            email,
            residential_address,
            nationality,
            govt_id_type,
            govt_id_number,
            emergency_contact_name,
            emergency_contact_phone,
            status,
            pos_x,
            pos_y,
        } = req.body;

        if (!full_name || !phone || !govt_id_type || !govt_id_number) {
            return res.status(400).json({
                error: "full_name, phone, govt_id_type and govt_id_number are required",
            });
        }

        // Human-friendly, sequential tourist_id (TS-1025, TS-1026, ...)
        const countResult = await db.execute("SELECT COUNT(*) AS count FROM tourists");
        const nextNum = 1024 + Number(countResult.rows[0].count) + 1;
        const tourist_id = `TS-${nextNum}`;

        await db.execute({
            sql: `INSERT INTO tourists
                    (tourist_id, full_name, age, gender, phone, email, residential_address,
                     nationality, govt_id_type, govt_id_number, emergency_contact_name,
                     emergency_contact_phone, status, pos_x, pos_y)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                tourist_id,
                full_name,
                age || null,
                gender || null,
                phone,
                email || null,
                residential_address || null,
                nationality || null,
                govt_id_type,
                govt_id_number,
                emergency_contact_name || null,
                emergency_contact_phone || null,
                status || "Safe",
                pos_x != null ? pos_x : null,
                pos_y != null ? pos_y : null,
            ],
        });

        await db.execute({
            sql: `INSERT INTO activities (tourist_id, tourist_name, activity_type, description)
                  VALUES (?, ?, ?, ?)`,
            args: [
                tourist_id,
                full_name,
                "REGISTERED",
                `New tourist ${full_name} registered.`,
            ],
        });

        const created = await db.execute({
            sql: "SELECT * FROM tourists WHERE tourist_id = ?",
            args: [tourist_id],
        });

        res.status(201).json(created.rows[0]);
    } catch (err) {
        console.error("Failed to create tourist:", err);
        if (String(err.message || "").toUpperCase().includes("UNIQUE")) {
            return res.status(409).json({ error: "This Govt ID Number is already registered" });
        }
        res.status(500).json({ error: "Failed to create tourist" });
    }
});

// PATCH /api/tourists/:tourist_id — update status and/or map position
// (called whenever a marker is dragged, so location + status stay live)
router.patch("/:tourist_id", async (req, res) => {
    try {
        const { tourist_id } = req.params;
        const { status, pos_x, pos_y } = req.body;

        await db.execute({
            sql: `UPDATE tourists SET
                    status = COALESCE(?, status),
                    pos_x = COALESCE(?, pos_x),
                    pos_y = COALESCE(?, pos_y)
                  WHERE tourist_id = ?`,
            args: [
                status || null,
                pos_x != null ? pos_x : null,
                pos_y != null ? pos_y : null,
                tourist_id,
            ],
        });

        const updated = await db.execute({
            sql: "SELECT * FROM tourists WHERE tourist_id = ?",
            args: [tourist_id],
        });

        if (!updated.rows[0]) {
            return res.status(404).json({ error: "Tourist not found" });
        }

        res.json(updated.rows[0]);
    } catch (err) {
        console.error("Failed to update tourist:", err);
        res.status(500).json({ error: "Failed to update tourist" });
    }
});

// DELETE /api/tourists/:tourist_id — remove a tourist from monitoring
router.delete("/:tourist_id", async (req, res) => {
    try {
        const { tourist_id } = req.params;

        const existing = await db.execute({
            sql: "SELECT full_name FROM tourists WHERE tourist_id = ?",
            args: [tourist_id],
        });
        if (!existing.rows[0]) {
            return res.status(404).json({ error: "Tourist not found" });
        }
        const name = existing.rows[0].full_name;

        // 1. Set tourist_id = NULL in activities so history records remain denormalized without FK violations
        await db.execute({
            sql: "UPDATE activities SET tourist_id = NULL WHERE tourist_id = ?",
            args: [tourist_id],
        });

        // 2. Remove related records in location_history and incidents
        await db.execute({
            sql: "DELETE FROM location_history WHERE tourist_id = ?",
            args: [tourist_id],
        });
        await db.execute({
            sql: "DELETE FROM incidents WHERE tourist_id = ?",
            args: [tourist_id],
        });

        // 3. Delete from tourists table
        await db.execute({
            sql: "DELETE FROM tourists WHERE tourist_id = ?",
            args: [tourist_id],
        });

        // 4. Log removal activity with null tourist_id (since tourist row is removed)
        await db.execute({
            sql: `INSERT INTO activities (tourist_id, tourist_name, activity_type, description)
                  VALUES (?, ?, ?, ?)`,
            args: [null, name, "REMOVED", `${name} removed from monitoring.`],
        });

        res.json({ success: true });
    } catch (err) {
        console.error("Failed to delete tourist:", err);
        res.status(500).json({ error: "Failed to delete tourist" });
    }
});

module.exports = router;