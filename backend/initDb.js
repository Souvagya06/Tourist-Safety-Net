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

                status TEXT DEFAULT 'Safe'
            )
        `);

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

        console.log("Database tables created successfully!");
    } catch (error) {
        console.error("Database initialization failed:", error);
    }
}

initializeDatabase();