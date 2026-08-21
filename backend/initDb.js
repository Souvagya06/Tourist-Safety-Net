const db = require("./config/db");

async function initializeDatabase() {
    try {
        // TOURISTS TABLE
        await db.execute(`
            CREATE TABLE IF NOT EXISTS tourists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                tourist_id TEXT UNIQUE NOT NULL,

                full_name TEXT NOT NULL,
                age INTEGER,
                gender TEXT,

                phone TEXT NOT NULL,
                email TEXT,

                residential_address TEXT,

                nationality TEXT,

                govt_id_type TEXT NOT NULL,
                govt_id_number TEXT UNIQUE NOT NULL,

                emergency_contact_name TEXT,
                emergency_contact_phone TEXT,

                registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,

                status TEXT DEFAULT 'Safe',

                -- Marker position on the dashboard map, stored as a percentage
                -- (0-100) of the map container's width/height, so a tourist's
                -- pin reappears where it was last dropped after a page reload.
                pos_x REAL,
                pos_y REAL
            )
        `);

        // Migration guard: adds pos_x/pos_y to a tourists table that was
        // created before these columns existed. Safe to run every boot —
        // duplicate-column errors are swallowed.
        const touristMigrations = [
            "ALTER TABLE tourists ADD COLUMN pos_x REAL",
            "ALTER TABLE tourists ADD COLUMN pos_y REAL",
        ];
        for (const sql of touristMigrations) {
            try {
                await db.execute(sql);
            } catch (err) {
                // Column already exists — ignore.
            }
        }

        // LOCATION HISTORY TABLE
        await db.execute(`
            CREATE TABLE IF NOT EXISTS location_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                tourist_id TEXT NOT NULL,

                latitude REAL NOT NULL,
                longitude REAL NOT NULL,

                recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (tourist_id)
                    REFERENCES tourists(tourist_id)
            )
        `);

        // INCIDENTS TABLE
        await db.execute(`
            CREATE TABLE IF NOT EXISTS incidents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                tourist_id TEXT NOT NULL,

                incident_type TEXT NOT NULL,

                description TEXT,

                status TEXT DEFAULT 'Active',

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                resolved_at DATETIME,

                FOREIGN KEY (tourist_id)
                    REFERENCES tourists(tourist_id)
            )
        `);

        // ACTIVITIES TABLE (new)
        // Stores every recent-activity event (registration, zone entry/exit,
        // removal) so the dashboard's "Recent Activity" panel has a durable
        // history independent of what's currently rendered on screen.
        await db.execute(`
            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                tourist_id TEXT,

                -- Denormalized so activity history still reads correctly
                -- even after the tourist row itself has been deleted.
                tourist_name TEXT,

                activity_type TEXT NOT NULL,
                    -- e.g. 'REGISTERED', 'ZONE_ENTER', 'ZONE_EXIT', 'REMOVED'

                description TEXT NOT NULL,

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (tourist_id)
                    REFERENCES tourists(tourist_id)
            )
        `);

        console.log("Database tables created successfully!");
    } catch (error) {
        console.error("Database initialization failed:", error);
    }
}

initializeDatabase();