# 🚀 NGO Donation Transparency & Volunteer Management System

A **production-deployed full-stack web application** that ensures **complete transparency in physical donations**, allowing donors to track **where, how, and how much of their donated items are used**.

---

## 🌐 Live Demo

🔗 **Frontend (CloudFront):**  
https://d27clyusnm7vlu.cloudfront.net  

🔗 **Backend API:**  
https://api.tracecaid.com  

---

## 🎯 Core Objective

To eliminate the lack of transparency in NGO systems by providing **real-time visibility and traceability of physical donations**.

Each donation is:
- 📦 Recorded  
- 📍 Tracked by location  
- 📊 Updated with usage details  
- 🔁 Reflected in real-time dashboards  

---

## 🚀 Key Features

### 📦 Physical Donation Transparency
- Track donated items (clothes, food, essentials)
- View where donations are used
- Monitor quantity used
- Check remaining stock
- Full visibility via donor dashboard

---

### 👤 Donor Dashboard
- Personal donation history
- Track item usage lifecycle
- View remaining inventory
- Transparent reporting of impact

---

### 🛠️ Admin Panel
- Manage donors and donations
- Approve and assign donations to campaigns
- Update:
  - Quantity used
  - Distribution location
  - Campaign details
- Maintain inventory records

---

### 🙋 Volunteer System
- Volunteer self-registration (name, address)
- Location-based campaign notifications 📍
- Email alerts for nearby donation drives 📧
- Participation confirmation workflow

---

### 📅 Campaign Management
- Create and manage donation drives
- Assign volunteers to campaigns
- Track distribution of physical items

---

## 🔐 Authentication & Authorization

### 🔑 JWT Authentication
- Secure login using JWT tokens
- Stateless authentication mechanism
- Token required for accessing protected APIs

### 🛡️ Role-Based Access Control (RBAC)

| Role | Access |
|------|-------|
| 👑 Admin | Full system access |
| 🙋 Volunteer | Campaign participation |
| 💰 Donor | Personal dashboard access |

---

## 🔒 Security Features
- Protected API routes
- Role-based access restrictions
- Secure password hashing
- Token-based authentication

---

## 🛠️ Tech Stack

### 🔹 Frontend
- React
- JavaScript
- HTML, CSS

### 🔹 Backend
- FastAPI
- REST APIs
- Async request handling

### 🔹 Database
- MariaDB (AWS RDS)

### 🔹 Deployment (AWS)
- **Frontend:** AWS S3 + CloudFront  
- **Backend:** AWS EC2 (Nginx + SSL)  
- **Database:** AWS RDS  
- **Domain & SSL:** Route 53 + Let's Encrypt  

---

## 🔄 System Workflow
Donor → Creates donation
Admin → Approves donation → Updates inventory
Admin → Assigns to campaign & location
Admin → Updates usage (quantity, status)
Donor → Tracks donation lifecycle in dashboard  


---

## 📁 Project Structure
NGO-Donations-and-volunteer-management/
│── backend/ # FastAPI APIs
│── frontend/ # React UI
│── database/ # MariaDB schema
│── README.md


---

## ⚙️ Installation & Setup

### 1. Clone Repository
bash
git clone https://github.com/apurva-ak47/NGO-Donations-and-volunteer-management.git
cd NGO-Donations-and-volunteer-management

---

## ⚙️ Installation & Setup

### 1. Clone Repository
bash
git clone https://github.com/apurva-ak47/NGO-Donations-and-volunteer-management.git
cd NGO-Donations-and-volunteer-management

🔑 Usage

👤 Donors
Track donation usage
View campaign distribution
Monitor remaining items

🛠️ Admins
Approve and manage donations
Update usage and inventory
Assign campaigns and locations

🙋 Volunteers
Register and receive campaign notifications
Confirm participation in donation drives


🎯 Future Enhancements
QR/Barcode-based donation tracking 📷
Real-time GPS tracking 📍
Blockchain-based transparency 🔗
Mobile application 📱
Advanced analytics dashboard
🤝 Contributing

Contributions are welcome!

Fork the repository
Create a feature branch
Commit your changes
Submit a pull request


👤 Author
Apurva
GitHub: https://github.com/apurva-ak47
