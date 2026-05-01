# NGO Donation Transparency & Volunteer Management System

A full-stack web application designed to ensure **complete transparency in physical donations**.
This system allows donors to track **where, how, and how much** of their donated items are used, building trust and accountability in NGO operations.

---

## 🌟 Core Objective

> Enable donors to **see the real impact of their donations** through complete visibility and tracking.

Every donation is:

* 📦 Recorded
* 📍 Tracked by location
* 📊 Updated with usage details
* 🔁 Reflected in real-time dashboards

---

## 🚀 Key Features

### 📦 Physical Donation Transparency

* Track donated items (clothes, food, essentials)
* View **where donations are used**
* Monitor **quantity used**
* Check **remaining stock**
* Full visibility via donor dashboard

---

### 👤 Donor Dashboard

* Personal donation history
* Track item usage and distribution
* View remaining inventory
* Transparent reporting of impact

---

### 🛠️ Admin Panel

* Manage donors and donations
* Update:

  * Quantity used
  * Distribution location
  * Campaign/event details
* Maintain records for:

  * Donors
  * Events
  * Inventory

---

### 🙋 Volunteer System

* Volunteer self-registration (name, address)
* Location-based campaign notifications 📍
* Email alerts for nearby donation drives 📧
* Volunteers confirm participation before joining

---

### 📅 Campaign Management

* Create and manage donation drives
* Assign volunteers to campaigns
* Track distribution of physical items

---

## 🔐 Authentication & Authorization

### 🔑 JWT Authentication

* Secure login using JWT tokens
* Stateless authentication mechanism
* Token required for accessing protected APIs

**Flow:**

1. User logs in
2. Server validates credentials
3. JWT token is issued
4. Token is used for all secure API requests

---

### 🛡️ Role-Based Access Control (RBAC)

#### 👑 Admin

* Full system access
* Manage donations, donors, volunteers, and events

#### 🙋 Volunteer

* View assigned campaigns
* Confirm participation

#### 💰 Donor

* Access personal dashboard
* Track donation usage and remaining items

---

### 🔒 Security Features

* Protected API routes
* Role-based access restrictions
* Secure password hashing
* Controlled data access

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React
* JavaScript
* HTML, CSS

### 🔹 Backend

* FastAPI
* RESTful APIs
* Async request handling

### 🔹 Database

* MariaDB
* Structured storage for donors, donations, events, volunteers

---

## 🔄 System Workflow

1. Donor donates physical items
2. Admin records donation in system
3. During campaigns:

   * Items are distributed
   * Usage is updated (quantity + location)
4. Donor dashboard updates in real time
5. Volunteers:

   * Get notified for nearby campaigns
   * Confirm participation

---

## 📁 Project Structure

NGO-Donations-and-volunteer-management/
│── backend/ (FastAPI APIs)
│── frontend/ (React UI)
│── database/ (MariaDB schema)
│── README.md

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/apurva-ak47/NGO-Donations-and-volunteer-management.git
cd NGO-Donations-and-volunteer-management
```

### 2. Backend Setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

---

## 🔑 Usage

* **Donors:** Track donation usage and remaining items
* **Admins:** Manage and update transparency records
* **Volunteers:** Join campaigns based on location

---

## 🎯 Future Enhancements

* QR/Barcode-based donation tracking 📷
* Real-time GPS tracking 📍
* Blockchain-based transparency 🔗
* Mobile application 📱
* Advanced analytics dashboard

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Submit a pull request

---

## 👤 Author

**Apurva**
GitHub: https://github.com/apurva-ak47

---

## 🌍 Impact

❌ Lack of transparency in traditional NGO systems
✅ This project ensures **complete visibility of physical donations**

By showing:

* Where donations are used
* How much is used
* What remains

It builds:

* Trust 🤝
* Accountability 📊
* Real impact 🌍

---
