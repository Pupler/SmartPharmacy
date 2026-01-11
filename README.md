# 💊 Smart Pharmacy

[![IN DEVELOPING](https://img.shields.io/badge/status-IN%20DEVELOPING-yellow)](https://github.com/Pupler/SmartPharmacy)
![.NET](https://img.shields.io/badge/.NET-8.0-blue)
![React](https://img.shields.io/badge/React-18.0-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)

A modern full-stack web application for **medication management**, **pharmacy discovery**, and **personal health tracking**, built with clean architecture and real-world scalability in mind.

## 📸 Preview

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e3ca2ea3-1e9e-41f9-9070-5f73b16cd60c" />

## ✨ Features (Planned)

- 🔍 **Medication Search** — search by drug name, active substance, or symptoms  
- 📍 **Pharmacy Locator** — nearby pharmacies with availability info  
- 💊 **Personal Medicine Cabinet** — medication tracking & schedules  
- ⏰ **Smart Reminders** — dose and prescription notifications  
- ⚠️ **Drug Interaction Checker** — safety checks for combinations  
- 📊 **Symptom Tracker** — health monitoring over time  
- 📅 **Prescription Management** — digital prescriptions  
- 🔐 **User Authentication** — secure accounts & roles  

## 🛠️ Technology Stack

### Backend
- **.NET 8 (ASP.NET Core)**  
- **C#**  
- **MySQL**  
- **Entity Framework Core**
- **JWT Authentication**

### Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **REST API integration**

### Architecture
- **Clean Architecture**
- **RESTful API**
- **DTO-based validation**

## 🚀 Getting Started

### Prerequisites
- .NET 8 SDK  
- Node.js 18+  
- MySQL Server

```bash
# Clone the repository
git clone https://github.com/Pupler/SmartPharmacy.git
cd SmartPharmacy

# Start MySQL Server

# Linux (systemd)
sudo systemctl start mysqld
sudo systemctl status mysqld

# Login to MySQL
mysql -u root -p

# Create Database
CREATE DATABASE smartpharmacy;
USE smartpharmacy;

# (Optional) Create Dedicated User
CREATE USER 'smartpharmacy_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON smartpharmacy.* TO 'smartpharmacy_user'@'localhost';
FLUSH PRIVILEGES;

# Create Medicines Table
CREATE TABLE Medicines (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    RequiresPrescription BOOLEAN NOT NULL DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# This schema matches the Entity Framework configuration used in the backend.

# Configure Connection String

# Edit Backend/appsettings.json:
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=smartpharmacy;User=root;Password=;"
  }
}

# ⚠️ Replace username and password with your actual MySQL credentials.

# Run Backend API
cd Backend
dotnet restore
dotnet run

API will start on:
http://localhost:5171

# Install Dependencies
cd frontend
npm install

# Run Frontend
npm run dev

Frontend will be available at:
http://localhost:5173
```

## 📄 License

This project is open source and available under the MIT License.
