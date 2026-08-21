# 🛡️ Smart Tourist Safety Monitoring & Incident Response System (Safetour)

A centralized tourist safety monitoring and incident response platform designed to help security and tourism authorities register tourists, monitor real-time locations, detect restricted high-risk zone intrusions via geofencing, and respond proactively to safety incidents.

---

## 📌 Problem Statement

Tourists visiting remote, hilly, border, or unfamiliar regions often face safety risks such as accidentally wandering into high-risk/restricted danger zones, getting lost, or encountering medical and environmental emergencies.

Traditionally, authorities have limited visibility over tourist movement and location, relying on delayed manual reporting after a tourist goes missing. The **Smart Tourist Safety Monitoring & Incident Response System** provides real-time visibility, automated geofence risk alerts, and centralized management to enable proactive intervention before emergencies escalate.

---

## 💻 Current Technology Stack

The Phase 1 prototype is built using a modern, lightweight, and scalable tech stack:

### 🎨 Frontend
* **Core Markup & Styling:** HTML5, Modern Responsive CSS (`frontend/css/style.css`).
* **UI Framework:** **Tailwind CSS** (via CDN with `@tailwindcss/forms` & container query plugins, customized with theme tokens).
* **Interactive Mapping Library:** **Leaflet.js (v1.9.4)** rendering **OpenStreetMap** tile layers with custom styled markers, drag-and-drop position controls, and dynamic circle overlay geofences.
* **Icons & Typography:** Google Fonts (**Inter**, **Plus Jakarta Sans**), **Material Symbols Outlined** icon sets.
* **Client-side Logic & Scripting:** Vanilla JavaScript (ES6+ modular script execution handling map state, geofence collision detection, modal dialogs, real-time alert triggers, and REST API communications).

### ⚙️ Backend
* **Runtime Environment:** **Node.js** (v18+)
* **Web Framework:** **Express.js (v5.2.1)** for building RESTful API endpoints and serving static frontend assets.
* **Environment Configuration:** **dotenv** for secret and database connection URL management.

### 🗄️ Database & Data Storage
* **Cloud Database:** **Turso Database** powered by **libSQL** (`@libsql/client` v0.17.4) — a modern, ultra-fast, distributed SQLite-compatible cloud database.
* **Database Management & Migrations:** `backend/initDb.js` providing automated table initialization, schema verification, and column migration guards on server startup.
* **Data Schemas:**
  * `tourists`: Stores profile details (Name, Age, Phone, Govt ID, Emergency Contact, Safety Status, and X/Y map coordinates).
  * `risk_zones`: Defines high-risk geographic danger zones (locality name, latitude, longitude, and radius in km/meters).
  * `activities`: Durable event history logging tourist registrations, restricted zone entries/exits, and record deletions.
  * `location_history`: Historical coordinate tracking per tourist for route auditing.
  * `incidents`: Safety incident records and resolution statuses.

---

## 🔄 System Architecture & Workflow

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          AUTHORITY DASHBOARD                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌───────────────────┐    ┌───────────────────┐    ┌──────────────┐   │
│   │ 👤 Add Tourist    │    │ 📍 Interactive    │    │ 🚨 Risk Zone │   │
│   │   Registration    │    │    Leaflet Map    │    │    Alerts    │   │
│   └─────────┬─────────┘    └─────────┬─────────┘    └──────▲───────┘   │
│             │                        │                     │           │
└─────────────┼────────────────────────┼─────────────────────┼───────────┘
              │                        │                     │
              ▼                        ▼                     │
┌────────────────────────────────────────────────────────────┴───────────┐
│                          EXPRESS 5 BACKEND API                         │
│  - /api/tourists   - /api/risk-zones   - /api/activities               │
└────────────────────────────────────────────────────────────┬───────────┘
                                                             │
                                                             ▼
                                                ┌────────────────────────┐
                                                │    TURSO CLOUD DB      │
                                                │ (libSQL / SQLite engine)│
                                                └────────────────────────┘
```

### 1️⃣ System Boot & Data Sync Workflow
1. When the dashboard page (`/dashboard`) loads, the client boots by executing parallel API requests (`GET /api/tourists`, `GET /api/activities`, `GET /api/risk-zones`).
2. Map pins and high-risk circular red zones are dynamically initialized on the Leaflet interactive map centered at the target geographic region.
3. Live safety statuses for all tourists are re-evaluated against loaded risk zones.

```text
Dashboard Load ──► Fetch (Tourists, Risk Zones, Activities) ──► Render Leaflet Map & Stats
```

---

### 2️⃣ Tourist Registration Workflow
1. Authorized personnel submit tourist information (Full Name, Age, Gender, Phone, Email, Address, Govt ID Type/Number, Emergency Contact) via the modal form.
2. The server auto-generates a human-friendly unique ID (e.g., `TS-1025`).
3. The backend inserts the record into Turso DB (`tourists` table) and automatically records a `REGISTERED` event in the `activities` table.
4. The frontend appends a new interactive marker on the Leaflet map and updates real-time statistics counters.

```text
Submit Registration ──► API POST /api/tourists ──► Store in Turso DB ──► Log Activity ──► Map Marker Appears
```

---

### 3️⃣ Interactive Location Monitoring & Simulation Workflow
1. Each tourist is represented by an interactive marker displaying their status (`Safe` or `At Risk`).
2. Authorities can drag tourist markers across the map interface to simulate real-time GPS movement.
3. Marker drop positions (`pos_x`, `pos_y` / coordinates) are saved to the backend database via `PATCH /api/tourists/:id/position` for persistence across sessions.

```text
Drag Tourist Marker ──► Update Position ──► Save Coordinates to DB ──► Re-calculate Proximity
```

---

### 4️⃣ Geofence Risk Detection & Security Alert Workflow
1. Whenever a tourist's location updates, the client calculates the distance between the tourist's coordinates and all active high-risk danger zone centers (`risk_zones`).
2. **If inside a Risk Zone:**
   * Tourist status updates immediately to **`At Risk`**.
   * An automated **🚨 Security Alert Modal** pops up displaying the tourist name, ID, zone locality, and time of detection.
   * An entry (`ZONE_ENTER`) is posted to `/api/activities` and displayed in the Recent Activity log.
3. **If exiting a Risk Zone:**
   * Tourist status reverts to **`Safe`**.
   * A `ZONE_EXIT` activity log is generated.

```text
Tourist Location Updates
          │
          ▼
Calculate Distance to Risk Zones
          │
      ┌───┴───┐
      │       │
    SAFE    INSIDE ZONE
      │       │
      ▼       ▼
   Status:  🚨 Trigger Security Alert
   "Safe"   Set Status: "At Risk"
            Log ZONE_ENTER Event
```

---

### 5️⃣ Record Deletion & Management Workflow
1. Authorities can select a tourist from the list or click their marker to view detailed information.
2. Selecting **"Delete Tourist"** triggers a confirmation prompt.
3. Upon confirmation, `DELETE /api/tourists/:id` removes the tourist from the database and logs a durable `REMOVED` activity event.
4. The marker is removed from the Leaflet map and system metrics update instantly.

---

## 🛠️ API Reference

### 👤 Tourists API (`/api/tourists`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tourists` | Fetch all registered tourists sorted by registration date |
| `POST` | `/api/tourists` | Register a new tourist (generates unique `TS-XXXX` ID) |
| `PATCH` | `/api/tourists/:id/position` | Update saved map position coordinates for a tourist |
| `DELETE` | `/api/tourists/:id` | Permanently delete a tourist record |

### 🔴 Risk Zones API (`/api/risk-zones`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/risk-zones` | Retrieve all active high-risk / restricted danger zones |
| `POST` | `/api/risk-zones` | Add a new danger zone (locality name, lat, lng, radius) |
| `DELETE` | `/api/risk-zones/:id` | Remove a high-risk danger zone |

### 📊 Activities API (`/api/activities`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/activities?limit=25` | Fetch durable recent activity history log |
| `POST` | `/api/activities` | Log system events (zone entry, exit, registration, deletion) |

---

## 📁 Repository Structure

```text
Tourist-Safety-Net/
├── backend/
│   ├── config/
│   │   └── db.js            # Turso libSQL client configuration & connection
│   ├── routes/
│   │   ├── tourists.js      # Express route handlers for tourist CRUD & location updates
│   │   ├── riskZones.js     # Express route handlers for high-risk geofence zones
│   │   └── activities.js    # Express route handlers for durable activity event logging
│   ├── initDb.js            # Table creation, migrations, and database seed logic
│   ├── server.js            # Main Express server & frontend static asset hosting
│   ├── .env                 # Database credentials (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)
│   └── package.json         # Backend dependencies (@libsql/client, express, dotenv)
├── frontend/
│   ├── css/
│   │   └── style.css        # Custom styles, responsive tweaks & map overrides
│   ├── js/                  # Modular client scripts (map.js, api.js, alerts.js, etc.)
│   ├── dashboard.html       # Centralized Authority Monitoring Dashboard
│   └── index.html           # Safetour Landing Page & Entry Portal
├── package.json             # Root configuration file
└── README.md                # Project documentation
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Node.js** (v18.x or higher)
* **npm** (v9.x or higher)
* A **Turso Database** instance (or libSQL compatible database)

---

### Step 1: Clone & Install Dependencies

```bash
git clone https://github.com/Souvagya06/Tourist-Safety-Net.git
cd Tourist-Safety-Net/backend
npm install
```

---

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
TURSO_DATABASE_URL=libsql://<your-database-name>.turso.io
TURSO_AUTH_TOKEN=<your-turso-auth-token>
```

---

### Step 3: Initialize Database

Run the database initialization script to create tables and migrations in your Turso database:

```bash
node backend/initDb.js
```

---

### Step 4: Start the Server

Start the backend development server:

```bash
npm run dev
# OR
node backend/server.js
```

---

### Step 5: Access the Web Application

Open your browser and navigate to:
* **Landing Page:** [`http://localhost:5000/`](http://localhost:5000/)
* **Authority Dashboard:** [`http://localhost:5000/dashboard`](http://localhost:5000/dashboard)

---

## 🔮 Future Roadmap

* 📡 **Live GPS Device Integration:** Real-world tracking via wearable hardware/mobile apps replacing simulated marker updates.
* 📱 **Mobile App for Tourists:** Dedicated tourist app with one-touch **SOS Emergency Button**, offline maps, and warning notifications.
* 🤖 **AI-Driven Anomaly Detection:** Automated route deviation detection flagging unusual tourist movement patterns in remote areas.
* 👨‍👩‍👧 **Emergency Contact SMS Alerts:** Automated SMS notifications sent to family members when a tourist enters a dangerous area.
* 🚓 **First Responder Dispatching:** Authority portal tools to dispatch local emergency responders directly to tourist GPS coordinates.

---

## 👥 Development Team

Developed by a dedicated 6-member team:

| No. | Team Member |
| :-: | --------------------- |
| 1 | **Souvagya Karmakar** |
| 2 | **Anirban Pal** |
| 3 | **Sushmita Roy** |
| 4 | **Bikram Pal** |
| 5 | **Saikat Mahara** |
| 6 | **Mayukh Paul** |

---

## 📄 License

This project is created for **Smart India Hackathon (SIH 2026)** prototype submission. All rights reserved.