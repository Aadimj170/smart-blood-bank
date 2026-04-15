const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// SYSTEM LOGS ENGINE (In-Memory)
// ==========================================
const systemLogs = [];

const addLog = (action, details, user = "System Admin") => {
    const logEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action,
        details,
        user
    };
    systemLogs.unshift(logEntry);
    if(systemLogs.length > 100) systemLogs.pop();
    
    // Ye line tere VS Code terminal mein bhi log print karegi taaki tujhe pata chale code chal raha hai
    console.log(`[LOG RECORDED] ${action}: ${details}`); 
};

// ==========================================
// DAA ALGORITHMS (Priority Queue & Graph)
// ==========================================
class PriorityQueue {
    constructor() { this.heap = []; }
    enqueue(request) {
        this.heap.push(request);
        this.bubbleUp(this.heap.length - 1);
    }
    dequeue() {
        if (this.heap.length === 0) return null;
        const max = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.sinkDown(0);
        }
        return max;
    }
    bubbleUp(index) {
        const element = this.heap[index];
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.heap[parentIndex];
            if (element.priority_level <= parent.priority_level) break;
            this.heap[parentIndex] = element;
            this.heap[index] = parent;
            index = parentIndex;
        }
    }
    sinkDown(index) {
        const length = this.heap.length;
        const element = this.heap[index];
        while (true) {
            let leftChildIdx = 2 * index + 1;
            let rightChildIdx = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIdx < length) {
                leftChild = this.heap[leftChildIdx];
                if (leftChild.priority_level > element.priority_level) swap = leftChildIdx;
            }
            if (rightChildIdx < length) {
                rightChild = this.heap[rightChildIdx];
                if ((swap === null && rightChild.priority_level > element.priority_level) || 
                    (swap !== null && rightChild.priority_level > leftChild.priority_level)) {
                    swap = rightChildIdx;
                }
            }
            if (swap === null) break;
            this.heap[index] = this.heap[swap];
            this.heap[swap] = element;
            index = swap;
        }
    }
}

// ==========================================
// ALL API ROUTES
// ==========================================

// --- 1. Fetch System Logs ---
app.get('/api/system-logs', (req, res) => {
    res.json(systemLogs);
});

// --- 2. Add New Donor (WITH LOGGING) ---
app.post('/api/add-donor', async (req, res) => {
    const { name, blood_group, contact, city_id } = req.body;
    try {
        const query = `INSERT INTO donor (name, blood_group, contact, city_id) VALUES (?, ?, ?, ?)`;
        await db.query(query, [name, blood_group, contact, city_id]);
        
        const [newDonor] = await db.query('SELECT LAST_INSERT_ID() as id');
        await db.query(`INSERT INTO donation (donor_id, bank_id, donation_date, units) VALUES (?, 1, CURDATE(), 1)`, [newDonor[0].id]);

        // LOG ACTION HERE
        addLog("REGISTER_DONOR", `New donor profile created: ${name} (${blood_group}) in Region ${city_id}.`);

        res.json({ message: "Donor added successfully!" });
    } catch (error) {
        console.error(error);
        addLog("ERROR_DB", `Failed to register donor ${name}. Database connection error.`);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- 3. Top Donors Leaderboard ---
app.get('/api/top-donors', async (req, res) => {
    try {
        const query = `
            SELECT d.name, d.blood_group, COUNT(don.donation_id) as total_donations
            FROM donor d
            JOIN donation don ON d.donor_id = don.donor_id
            GROUP BY d.donor_id
            ORDER BY total_donations DESC
            LIMIT 5;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Fetch ALL Donors with History (For CRM Directory) ---
app.get('/api/donors', async (req, res) => {
    try {
        const query = `
            SELECT d.donor_id, d.name, d.blood_group, d.contact, d.city_id,
                   MAX(don.donation_date) as last_donation,
                   COUNT(don.donation_id) as total_donations
            FROM donor d
            LEFT JOIN donation don ON d.donor_id = don.donor_id
            GROUP BY d.donor_id
            ORDER BY d.donor_id DESC;
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- 4. Emergency Priority Queue ---
app.get('/api/emergency-queue', async (req, res) => {
    try {
        const query = `
            SELECT r.request_id, p.patient_name, r.blood_group, r.units_required, r.priority_level
            FROM bloodrequest r
            JOIN patient p ON r.patient_id = p.patient_id
        `;
        const [rows] = await db.query(query);
        
        const pq = new PriorityQueue();
        rows.forEach(row => pq.enqueue(row));
        
        const sortedRequests = [];
        while(pq.heap.length > 0) {
            sortedRequests.push(pq.dequeue());
        }
        res.json(sortedRequests);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// --- 5. Smart Donor Recommendation ---
app.get('/api/recommend-donors', async (req, res) => {
    const { blood_group, city_id } = req.query;
    try {
        const query = `
            SELECT name, contact, last_donation_date, 
                   DATEDIFF(CURDATE(), last_donation_date) as days_since_last
            FROM donor 
            WHERE blood_group = ? AND city_id = ? 
            AND (last_donation_date IS NULL OR DATEDIFF(CURDATE(), last_donation_date) >= 90)
            ORDER BY days_since_last DESC;
        `;
        const [donors] = await db.query(query, [blood_group, city_id]);
        
        if (donors.length > 0) {
            addLog("SEARCH_QUERY", `Smart Search executed for ${blood_group} blood in Region ${city_id}. Found ${donors.length} eligible donors.`);
        }

        res.json(donors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 6. Demand Prediction ---
app.get('/api/demand-prediction', async (req, res) => {
    try {
        const query = `
            SELECT blood_group, SUM(units_required) as total_demand
            FROM bloodrequest
            WHERE MONTH(request_date) = MONTH(CURDATE()) AND YEAR(request_date) = YEAR(CURDATE())
            GROUP BY blood_group
            ORDER BY total_demand DESC;
        `;
        const [demand] = await db.query(query);
        res.json(demand);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 7. Blood Storage Optimization (Knapsack) ---
app.post('/api/optimize-transport', async (req, res) => {
    const { vehicleCapacity, bloodUnits } = req.body; 
    const n = bloodUnits.length;
    let dp = Array(n + 1).fill().map(() => Array(vehicleCapacity + 1).fill(0));
    const values = bloodUnits.map(b => 42 - b.days_to_expiry); 
    const weights = bloodUnits.map(b => b.units);

    for (let i = 0; i <= n; i++) {
        for (let w = 0; w <= vehicleCapacity; w++) {
            if (i === 0 || w === 0) dp[i][w] = 0;
            else if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    addLog("OPTIMIZATION_RUN", `0/1 Knapsack executed for vehicle capacity ${vehicleCapacity} Units. Max Utility Score: ${dp[n][vehicleCapacity]}`);
    res.json({ maxUtility: dp[n][vehicleCapacity], message: "Transport optimized." });
});

// --- 8. Shortest Path (Dijkstra) ---
app.post('/api/shortest-path', (req, res) => {
    const { source, destination } = req.body;

    const graph = {
        'Mumbai': { 'Pune': 150, 'Nashik': 170, 'Surat': 280 },
        'Pune': { 'Mumbai': 150, 'Nashik': 210, 'Satara': 110 },
        'Nashik': { 'Mumbai': 170, 'Pune': 210, 'Aurangabad': 190 },
        'Surat': { 'Mumbai': 280, 'Ahmedabad': 260 },
        'Satara': { 'Pune': 110, 'Kolhapur': 120 },
        'Aurangabad': { 'Nashik': 190, 'Pune': 230 },
        'Kolhapur': { 'Satara': 120 },
        'Ahmedabad': { 'Surat': 260 }
    };

    if (!graph[source] || !graph[destination]) {
        return res.status(400).json({ error: "Invalid cities selected" });
    }

    const distances = {};
    const previous = {};
    const unvisited = new Set(Object.keys(graph));

    Object.keys(graph).forEach(city => {
        distances[city] = Infinity;
        previous[city] = null;
    });
    distances[source] = 0;

    while (unvisited.size > 0) {
        let currentCity = null;
        let minDistance = Infinity;

        unvisited.forEach(city => {
            if (distances[city] < minDistance) {
                minDistance = distances[city];
                currentCity = city;
            }
        });

        if (currentCity === null || currentCity === destination) break;

        unvisited.delete(currentCity);

        for (let neighbor in graph[currentCity]) {
            let alt = distances[currentCity] + graph[currentCity][neighbor];
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = currentCity;
            }
        }
    }

    const path = [];
    let curr = destination;
    while (curr) {
        path.unshift(curr);
        curr = previous[curr];
    }
    
    addLog("ROUTING_CALC", `Dijkstra path calculated from ${source} to ${destination}. Distance: ${distances[destination]}km`);

    res.json({ path: path.join(' → '), totalDistance: distances[destination] });
});

// --- 9. Live Fridge Inventory ---
app.get('/api/inventory', async (req, res) => {
    try {
        const query = `
            SELECT blood_group, SUM(units_available) as total_units, MIN(expiry_date) as nearest_expiry
            FROM bloodstock
            WHERE expiry_date > CURDATE()
            GROUP BY blood_group
            ORDER BY FIELD(blood_group, 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+');
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`BloodLink Master Backend running on port ${PORT}`));