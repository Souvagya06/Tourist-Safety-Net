// Turso (libSQL) client.
// Requires: npm install @libsql/client dotenv
//
// Reads TURSO_DATABASE_URL and TURSO_AUTH_TOKEN from backend/.env, e.g.:
//   TURSO_DATABASE_URL=libsql://<your-db>.turso.io
//   TURSO_AUTH_TOKEN=<your-token>
//
// If you're actually using a different client (better-sqlite3, plain sqlite3,
// etc.) let me know and I'll adjust this file and the query calls in the
// route files to match that library's API instead.

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { createClient } = require("@libsql/client");

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    throw new Error(
        "Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN. " +
        "Check that backend/.env exists and has valid credentials."
    );
}

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

module.exports = db;