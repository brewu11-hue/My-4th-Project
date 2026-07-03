Link to website: 

# 🌐 Project 4: B2B Enterprise ERP & Procurement Platform

### 🚀 Live Production Deployment
**Architecture Track:** Full-Stack Enterprise Automation & Resource Management

---

## 📊 System Overview
This platform is a scalable, production-ready B2B Enterprise Resource Planning (ERP) and Procurement application designed to handle high-density industrial logistics, automated corporate invoicing, and fleet asset tracking data fields natively. 

Built using a completely decoupled architecture, the platform simulates real-world industrial supply chain mechanics—such as provisioning high-tier engineering hardware hardware arrays (M-series MacBook deployment fleets) and deploying heavy physical site assets (mobile office containers and specialized tool storage modules) under strict regulatory compliance parameters.

---

## ⚙️ Core Technical Features
*   **Decoupled B2B Procurement Engine**: A high-performance JavaScript/Node.js validation module that dynamically encapsulates multi-lane hardware and logistics inputs into an immutable system data payload.
*   **Statutory Compliance Injection**: Automatically processes line-item totals and handles the strict injection of the 15% South African VAT statutory compliance rule on all processed vendor ledgers.
*   **Immutable Transaction Log Tracking**: Generates unique system-clean reference keys (`B2B-ERP-XXXXXX`) and outputs clean JSON data blocks ready for secure real-time cloud data storage injection.
*   **Responsive Executive Dashboard View**: A streamlined, modern user interface built using semantic HTML, structural CSS layout techniques, and dynamic DOM manipulation to display live system logs and financial totals instantly without latency.

---

## 🛠️ Technology Stack & Environment
*   **Runtime Environment:** Node.js (ECMAScript 6+)
*   **Frontend Architecture:** Vanilla JavaScript, Semantic HTML5, Structural CSS3 / Modern Flexbox Grid
*   **Deployment Infrastructure:** Vercel Production Environment Pipeline
*   **Data Models Staging:** Optimized JSON Object Structures configured for direct Google Cloud Cloud Firestore collection routing

---

## 💾 Core Logic Execution Sample
The heart of the enterprise calculation block isolates raw line items, computes the math securely on the backend server layer, and outputs a certified ledger:

```javascript
const SA_VAT_RATE = 0.15; // Statutory 15% South African VAT
let rawSubtotal = 0;

hardwareAllocation.forEach(item => {
    rawSubtotal += (item.quantity * item.unitPrice);
});

const calculatedVat = rawSubtotal * SA_VAT_RATE;
const certifiedGrandTotal = rawSubtotal + calculatedVat;
```

---

## 📂 Repository Structure
```text
├── index.html          # Main B2B Enterprise Client Dashboard Layout
├── styles.css          # Semantic CSS UI Layout & Flexbox Configuration
├── app.js              # Live Client Data Controller & DOM Logic
├── b2bProcurement.js   # Main Backend Invoicing Validation Engine
└── README.md           # Professional Technical Documentation Base
```

---

## 🧠 Architectural Philosophy
This application operates strictly on an **async-first, high-autonomy blueprint**, mirroring the exact principles expected from a **Manager of One** running enterprise workflows. By decoupling the calculation logic from raw database states, the system maintains strict data integrity and handles multi-million-rand transaction records cleanly under operational pressure.

Developed and maintained by **Benedict Bongani** — Technical Operations Architect.
