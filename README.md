# Order Status Integration Hub

A unified API and dashboard for tracking orders from legacy systems, built with **Node.js (Express)** and **TypeScript**.

## Quick Start
1.  **Install**: `npm install`
2.  **Run**: `npm run dev`
3.  **View**: Open `http://localhost:3000`

## Features
-   **Unified Data**: Normalizes JSON and CSV data from two different systems.
-   **REST API**: Simple endpoints to query and filter orders.
-   **Dashboard**: Real-time search and status filtering.

## API Endpoints
-   `GET /api/health`: Check server status.
-   `GET /api/orders`: List all orders.
-   `GET /api/orders/search?status={status}`: Filter by status (e.g., `Pending`).
-   `GET /api/orders/{id}`: Get order details.

## Project Structure
-   `backend/`: Express server and data normalization logic.
-   `frontend/`: Static HTML/CSS/JS dashboard.
-   `data/`: Source data files.
