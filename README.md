#🩸 HemaSmart: Intelligent Blood Supply Chain & Logistics Network


## PROJECT MEMBERS
1. AADI JAIN- RA2411030030055
2. NANDINI SHARMA- RA2411030030056
3. DAKSH BANSAL- RA2411030030064


### 📁 Project Documents

| SR. NO. | DESCRIPTION                 | LINK |
|:------:|----------------------------|:----:|
| 1 | PROJECT CODE | [Open](#) |
| 2 | PROJECT REPORT | [Open](https://github.com/Aadimj170/smart-blood-bank/blob/main/DBMS%20PROJECT%20REPORT.pdf) |
| 3 | CERTIFICATE_AADI_055 | [Open](https://github.com/Aadimj170/smart-blood-bank/blob/main/DBMS%20certificate.pdf) |
| 4 | COURSE_REPORT_AADI_055 | [Open](https://github.com/Aadimj170/smart-blood-bank/blob/main/COURSE_REPORT_AADI_055.pdf) |
| 5 | CERTIFICATE_NANDINI_056 | [Open](https://github.com/Aadimj170/smart-blood-bank/blob/main/Nandini.jpg) |
| 6 | COURSE_REPORT_NANDINI_056 | [Open](https://github.com/Aadimj170/smart-blood-bank/blob/main/DBMS_Course_Report_Nandini_Sharma.pdf) |
| 7 | CERTIFICATE_DAKSH_064 | [Open](https://github.com/Aadimj170/smart-blood-bank/blob/main/Daksh.jpg) |
| 8 | COURSE_REPORT_DAKSH_064 | [Open](https://github.com/Aadimj170/smart-blood-bank/blob/main/course_report_daksh_064.pdf) |
| 9 | FINAL PPT | [Open](https://github.com/Aadimj170/smart-blood-bank/blob/main/FINAL_PPT_BLOOD_BANK.pptx) |
|10 | ERD | [Open](https://github.com/Aadimj170/smart-blood-bank/blob/main/ERD%20BLOOD%20LINK%20UPDATED.pdf) |




#🩸 HemaSmart: Intelligent Blood Supply Chain & Logistics Network

![HemaSmart Cover](https://img.shields.io/badge/Status-Active-success.svg) 
![Version](https://img.shields.io/badge/Version-2.0_Enterprise-blue.svg) 
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB.svg) 
![Node](https://img.shields.io/badge/Backend-Node.js-339933.svg)

**HemaSmart** is an enterprise-grade, full-stack web application designed to digitize, optimize, and secure the entire blood bank supply chain. Moving beyond basic CRUD operations, HemaSmart integrates **Clinical Safety Protocols**, **Advanced Data Structures & Algorithms (DAA)**, and a **Simulated AI Copilot** to prevent blood wastage and accelerate emergency response.

---

## ✨ Key Features

HemaSmart is divided into 6 core operational modules:

### 1. 🧠 AI Intelligence & Analytics
* **HemaSmart Copilot:** A simulated Generative AI workspace for natural language querying (e.g., "Check inventory status").
* **Interactive Data Analytics:** Dynamic Recharts visualizing 6-month demand vs. supply forecasting, live cold storage distribution, and donation camp yields.

### 2. 👥 Donor CRM (Customer Relationship Management)
* **Smart Donor Directory:** Complete record management with dynamic eligibility calculation (enforcing the 90-day cooldown period).
* **Targeted Recommendation:** Automatically filters and recommends eligible donors for specific blood groups during regional shortages.

### 3. 🏥 Clinical & Medical Safety
* **Crossmatch & Issue Protocol:** Validates biological compatibility (e.g., A+ recipient receiving O-) and records serology crossmatching before authorizing dispatch.
* **Lab Processing:** Tracks the fractionation of blood into components (Packed RBCs, Plasma, Platelets) and screens for reactive infections.
* **HemaBot Triage:** An interactive screening wizard to calculate donor eligibility based on medical history, age, and weight.

### 4. 🚚 Logistics & Algorithms (Core Engine)
* **Storage Optimization (0/1 Knapsack):** Maximizes transport vehicle utility by selecting blood bags based on capacity and days left to expiry.
* **Emergency Routing (Dijkstra's Algorithm):** Calculates the shortest delivery path and distance between regional cities for critical dispatches.
* **Cold Storage Matrix:** Live telemetry of refrigerator inventory.
* **Demand Prediction:** Aggregates hospital requests to forecast future shortages.

### 5. 🖥️ System & Security
* **Immutable Audit Logs:** An in-memory, terminal-style security ledger that automatically records every system action (Donor Registration, Routing, Optimization) with timestamps to ensure clinical accountability.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React.js (Bootstrapped with Vite)
* **Styling:** Tailwind CSS (Modern, spacious, Apple-like UI)
* **Routing:** React Router DOM
* **Data Visualization:** Recharts

### Backend
* **Environment:** Node.js
* **Framework:** Express.js
* **Algorithms:** JavaScript (Custom DP, Graph, and Heap implementations)

### Database
* **RDBMS:** MySQL (Ensures strict ACID compliance for sensitive healthcare data)

---

## ⚙️ Core Algorithms Implemented

1. **Dijkstra's Shortest Path Algorithm:** Used in the `Emergency Routing` module to find the fastest transport route between city nodes in the supply chain graph.
2. **0/1 Knapsack Problem (Dynamic Programming):** Used in `Storage Optimization` to select the most critical blood bags (maximizing utility score based on expiry dates) without exceeding transport vehicle capacity.
3. **Priority Queue (Min/Max Heap):** Used in the `Main Dashboard` to automatically sort the active dispatch queue, ensuring patients with "Critical" status (Priority Level 5) are served before "Normal" requests.

---

## 🚀 Installation & Setup Guide

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* [MySQL](https://www.mysql.com/) installed and running

### 1. Database Setup
1. Open your MySQL client and create a new database: `CREATE DATABASE smart_blood_bank;`
2. Execute your SQL schema script to create the necessary tables (`donor`, `donation`, `bloodrequest`, `bloodstock`).
3. Update the database connection credentials inside `backend/db.js` (User, Password, Database Name).

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and start the server:
```bash
cd backend
npm install
node index.js



this is the entire readme file can you please fit it
