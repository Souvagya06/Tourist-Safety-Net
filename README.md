# 🛡️ Smart Tourist Safety Monitoring & Incident Response System

A centralized tourist safety monitoring and incident response system designed to help security and tourism authorities register tourists, monitor their locations, identify potential safety risks, and respond quickly to incidents.

---

## 📌 Problem Statement

Tourists visiting remote, hilly, border, or unfamiliar regions may unknowingly enter unsafe or restricted areas, lose their way, or encounter emergency situations.

Currently, authorities may have limited visibility over the movement and location of tourists. In many cases, action can only be taken after a tourist is reported missing or an incident has already occurred.

The **Smart Tourist Safety Monitoring & Incident Response System** aims to address this problem by providing a centralized platform through which authorized authorities can register tourists, monitor their locations, identify potential risk situations, and respond more effectively.

---

## 🎯 Our Solution

The proposed system provides an **Authority Dashboard** where authorized personnel can manage and monitor registered tourists from a centralized platform.

The system is designed around the following workflow:

```text
Tourist Registration
        │
        ▼
Tourist Added to Centralized Database
        │
        ▼
Location Monitoring
        │
        ▼
Authority Dashboard
        │
        ▼
Risk / Restricted Zone Detection
        │
        ▼
🚨 Security Alert
        │
        ▼
Incident Response
```

The goal is to support a more **proactive approach to tourist safety**, allowing authorities to identify potential risks before they escalate into serious incidents.

---

## ✨ Key Features

* 👤 Tourist registration and centralized record management
* 🗺️ Interactive map-based monitoring dashboard
* 📍 Visualization of tourist locations on the map
* 🔍 Individual tourist information retrieval
* ➕ Add new tourists to the system
* 🗑️ Permanently delete tourist records
* 🔴 High-risk and restricted zone visualization
* 🚨 Automatic alert generation when a tourist enters a restricted zone
* 📊 Centralized monitoring for security authorities
* 🔄 Simulated tourist movement for prototype demonstration

---

# 🧪 Phase 1 Prototype

The Phase 1 prototype demonstrates the core concept and workflow of the proposed system.

For the prototype, tourist movement is simulated interactively. In the complete implementation, simulated location updates can be replaced with real-time GPS-based location data.

---

## 1️⃣ Tourist Registration

Authorized personnel can add a new tourist to the system by entering the required information.

After registration:

1. Tourist information is stored in the database.
2. A unique tourist record is created.
3. The tourist appears on the authority dashboard.
4. A corresponding marker is displayed on the map.

```text
Add Tourist
      │
      ▼
Submit Tourist Details
      │
      ▼
Store in Database
      │
      ▼
Tourist Marker Appears on Map
```

---

## 2️⃣ Interactive Tourist Monitoring

All registered tourists are represented by individual markers on an interactive map.

The authority can view multiple tourists from a centralized dashboard and monitor their current displayed locations.

```text
┌─────────────────────────────────────────┐
│          AUTHORITY DASHBOARD            │
├─────────────────────────────────────────┤
│                                         │
│        👤 Tourist 1                     │
│                                         │
│                 🔴 RED ZONE             │
│                                         │
│    👤 Tourist 2                         │
│                                         │
│                              👤 Tourist 3│
│                                         │
└─────────────────────────────────────────┘
```

---

## 3️⃣ View Tourist Details

When an authority clicks on a tourist marker, detailed information about that particular tourist is retrieved from the database and displayed.

The information may include:

* Tourist Name
* Tourist ID
* Age
* Gender
* Contact Information
* Emergency Contact
* Current Safety Status
* Location Information

```text
Click Tourist Marker
        │
        ▼
Fetch Tourist Details
        │
        ▼
Retrieve Data from Database
        │
        ▼
Display Tourist Information
```

---

## 4️⃣ Tourist Record Management

The system allows authorized personnel to permanently remove a tourist from the system.

The deletion process includes a confirmation step to prevent accidental removal.

```text
Select Tourist
       │
       ▼
View Tourist Details
       │
       ▼
Click "Delete Tourist"
       │
       ▼
Confirmation Required
       │
       ▼
Delete from Database
       │
       ▼
Remove Marker from Map
```

After deletion, the tourist record is permanently removed from the database.

---

## 5️⃣ Restricted Zone Detection

The authority dashboard contains predefined **high-risk or restricted zones**.

For the Phase 1 prototype, a tourist marker can be moved interactively to simulate changes in location.

Whenever the tourist's location changes, the system checks whether the tourist has entered a restricted zone.

```text
Tourist Location Changes
          │
          ▼
Check Current Coordinates
          │
          ▼
Is Tourist Inside Restricted Zone?
          │
      ┌───┴───┐
      │       │
     NO      YES
      │       │
      ▼       ▼
Continue   🚨 Generate Alert
Monitoring
```

---

## 🚨 Automated Security Alert

When a tourist enters a designated restricted or high-risk zone, the system automatically generates a security alert.

The alert can contain information such as:

* Tourist Name
* Tourist ID
* Current Location
* Restricted Zone Information
* Time of Detection
* Current Safety Status

### Example Alert

```text
🚨 SECURITY ALERT

Tourist: Rahul Sharma
Tourist ID: TS-1024

⚠️ ALERT:
The tourist has entered a restricted zone.

Current Status: AT RISK

[ View Details ] [ Acknowledge ]
```

This allows security authorities to quickly identify the affected tourist and take appropriate action.

---

# 🔄 Prototype Workflow

The complete demonstration flow for the Phase 1 prototype is:

```text
┌──────────────────────┐
│   Open Dashboard     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    Add a Tourist     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Store Data in Database│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Tourist Appears on Map│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Click Tourist Marker │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Display Tourist Data │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Simulate Movement    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Tourist Enters       │
│ Restricted Zone      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 🚨 Security Alert    │
└──────────────────────┘
```

---

# 🔮 Future Scope

The Phase 1 prototype demonstrates the core concept of the proposed system.

The complete system can be extended with:

* 📡 Real-time GPS-based location tracking
* 📱 Dedicated tourist tracking devices
* 🆘 SOS and emergency assistance
* 🗺️ Advanced geofencing
* 🧭 Route monitoring and deviation detection
* 🔔 Automatic emergency notifications
* 👨‍👩‍👧 Emergency contact alerts
* 🚓 Authority response management
* 🔍 Search and rescue coordination
* 📊 Safety analytics and insights
* 🌐 Multi-region deployment

---

# 👥 Team

This project is being developed by a team of **6 members**.

| No. | Team Member           |
| :-: | --------------------- |
|  1  | **Souvagya Karmakar** |
|  2  | **Anirban Pal**       |
|  3  | **Sushmita Roy**      |
|  4  | **Bikram Pal**        |
|  5  | **Saikat Mahara**     |
|  6  | **Mayukh Paul**       |

---

# 🚀 Project Vision

Our vision is to build a reliable and scalable tourist safety ecosystem that enables authorities to maintain better awareness of registered tourists and respond quickly to potential safety incidents.

Instead of relying solely on manual reporting after a tourist goes missing, the proposed system aims to support a **proactive, centralized, and technology-driven approach to tourist safety and incident response**.

---