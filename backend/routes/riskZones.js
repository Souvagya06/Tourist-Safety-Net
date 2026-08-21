const express = require("express");
const db = require("../config/db");

const router = express.Router();

// GET /api/risk-zones — fetch all active high risk danger zones
router.get("/", async (req, res) => {
    try {
        const result = await db.execute(
            "SELECT * FROM risk_zones ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Failed to fetch risk zones:", err);
        res.status(500).json({ error: "Failed to fetch risk zones" });
    }
});

// POST /api/risk-zones — save a new high risk danger zone
router.post("/", async (req, res) => {
    try {
        const { locality_name, latitude, longitude, radius_km, radius_meters } = req.body;

        if (!locality_name || latitude == null || longitude == null) {
            return res.status(400).json({
                error: "locality_name, latitude, and longitude are required",
            });
        }

        const radiusKm = radius_km != null
            ? Number(radius_km)
            : (radius_meters != null ? Number(radius_meters) / 1000 : 3.0);
        const radiusM = radius_meters != null ? Number(radius_meters) : radiusKm * 1000;

        let result;
        try {
            result = await db.execute({
                sql: `INSERT INTO risk_zones (locality_name, latitude, longitude, radius_meters, radius_km)
                      VALUES (?, ?, ?, ?, ?)`,
                args: [locality_name.trim(), Number(latitude), Number(longitude), radiusM, radiusKm],
            });
        } catch (colErr) {
            // Fallback if table was created without radius_km column
            result = await db.execute({
                sql: `INSERT INTO risk_zones (locality_name, latitude, longitude, radius_meters)
                      VALUES (?, ?, ?, ?)`,
                args: [locality_name.trim(), Number(latitude), Number(longitude), radiusM],
            });
        }

        const insertId = Number(result.lastInsertRowid);
        const created = await db.execute({
            sql: "SELECT * FROM risk_zones WHERE id = ?",
            args: [insertId],
        });

        const row = (created.rows && created.rows[0]) ? created.rows[0] : {};
        res.status(201).json({
            id: row.id || insertId,
            locality_name: row.locality_name || locality_name.trim(),
            latitude: Number(row.latitude != null ? row.latitude : latitude),
            longitude: Number(row.longitude != null ? row.longitude : longitude),
            radius_km: row.radius_km != null ? Number(row.radius_km) : (row.radius_meters ? Number(row.radius_meters) / 1000 : radiusKm),
            radius_meters: row.radius_meters != null ? Number(row.radius_meters) : radiusM
        });
    } catch (err) {
        console.error("Failed to create risk zone:", err);
        res.status(500).json({ error: "Failed to create risk zone" });
    }
});

// DELETE /api/risk-zones/:id — remove a high risk danger zone
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await db.execute({
            sql: "SELECT * FROM risk_zones WHERE id = ?",
            args: [id],
        });

        if (!existing.rows || existing.rows.length === 0) {
            return res.status(404).json({ error: "Risk zone not found" });
        }

        await db.execute({
            sql: "DELETE FROM risk_zones WHERE id = ?",
            args: [id],
        });

        res.json({ success: true, deleted: existing.rows[0] });
    } catch (err) {
        console.error("Failed to delete risk zone:", err);
        res.status(500).json({ error: "Failed to delete risk zone" });
    }
});

module.exports = router;
