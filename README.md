# 🚛 GreenLink Logistics

**Intelligent Logistics & Route Optimization Platform**

GreenLink Logistics is an enterprise-grade, full-stack logistics platform designed to solve the **Vehicle Routing Problem (VRP)** using a hybrid Java/Python architecture. It empowers businesses to optimize delivery routes, track drivers in real-time, and manage orders through a secure, modern dashboard.

Built with a cutting-edge tech stack, GreenLink demonstrates a seamless integration of high-performance backend logic with a responsive, map-centric frontend.

## ⚙️ Tech Stack

* **TypeScript**
* **Next.js 14 (App Router)**
* **Tailwind CSS**
* **Java 17 (Spring Boot 3)**
* **Spring Security (JWT)**
* **PostgreSQL**
* **Python 3.9 + Pandas**
* **Google OR-Tools**
* **Docker & Docker Compose**
* **AWS (EC2, RDS)**
* **React Leaflet (OpenStreetMap)**

## 🔋 Features

### 🔐 Secure Authentication & RBAC

* **JWT-Based Security:** Stateless authentication using JSON Web Tokens.
* **Role-Based Access Control:** Distinct portals for **Dispatchers** (Admin) and **Drivers**.
* **Secure API:** Protected endpoints ensuring data privacy and integrity.

### 📍 AI-Powered Route Optimization

* **Hybrid Engine:** Java backend orchestrates a **Python subprocess** to run complex VRP algorithms.
* **Smart Routing:** Optimizes for shortest distance and time across multiple vehicles.
* **Automatic Assignment:** Instantly assigns unassigned orders to the most efficient driver.

### 🗺️ Real-Time Dispatcher Dashboard

* **Live Map Visualization:** Interactive **Leaflet** maps displaying routes, stops, and vehicle positions.
* **Auto-Refresh:** Real-time polling updates order statuses instantly without page reloads.
* **Visual Analytics:** At-a-glance statistics for total, pending, and completed deliveries.

### 📱 Mobile-First Driver Portal

* **Dedicated Interface:** A simplified, distraction-free web view designed for mobile devices.
* **One-Tap Navigation:** Deep integration with **Google Maps/Waze** for instant turn-by-turn directions.
* **Status Updates:** Drivers can mark orders as "DELIVERED" with a single tap, syncing instantly with the dashboard.

### 🚛 Fleet & Order Management

* **Full CRUD Capabilities:** Easily add, edit, or remove Vehicles and Orders.
* **Reverse Geocoding:** Automatically converts raw GPS coordinates into human-readable addresses using **OpenStreetMap**.
* **Capacity Planning:** Manages vehicle weight limits and service duration constraints.

### ☁️ Cloud-Native & Scalable

* **Dockerized:** Fully containerized backend (Java+Python) and frontend for consistent deployment.
* **AWS Ready:** Configured for deployment on **AWS EC2** (Compute) and **RDS** (Database).
* **Production Grade:** Includes structured logging, error handling, and environment configuration.
