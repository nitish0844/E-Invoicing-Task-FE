
# E-Invoicing Frontend

## Project Overview
E-Invoicing Frontend is a React.js application that allows users to upload invoices, analyze them, and view detailed reports and dashboards. It provides a user-friendly interface for managing invoice data and visualizing analytics.

---

## Tech Stack
- **Framework:** React.js  
- **UI Library:** Mantine  
- **State Management:** Zustand  
- **Charts & Visualization:** Recharts  
- **Data Fetching:** TanStack Query (React Query)  

---

## Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-folder>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:  
   Create a `.env` file if needed for API URLs or keys (e.g., `VITE_API_URL="https://your-backend-url.com"`).

4. Start the development server:
```bash
npm run dev
```

---

## Features / Screens

- **Dashboard**: Displays charts and analytics for uploaded invoices.  
- **Analyze Page**: Upload CSV or JSON files to analyze invoices. Provides a score for the uploaded file and stores results.  
- **Reports Page**: View all uploaded reports. Click on a report to see detailed scores and analysis.  

---

## API Integration

The frontend communicates with the backend via the following routes:

| Route               | Description                              |
|--------------------|------------------------------------------|
| `/auth`             | Authentication (login)                   |
| `/report`           | Generate reports                          |
| `/analyze`          | Analyze invoice data                      |
| `/upload`           | Upload files                              |
| `/fields`           | Manage collection fields                  |
| `/email`            | Send emails                               |
| `/dashboard`        | Analytics dashboard                        |

---

## Example: Add a New User

You can register a new user via Postman or Insomnia using the following curl:

```bash
curl --request POST   --url https://e-invoicing-task-be.onrender.com/auth/register   --header 'Content-Type: application/json'   --data '{
    "name": "hello",
    "email": "hello@gmail.com",
    "password": "123456"
}'
```

---

## Additional Info
- Ensure the backend is running before using the frontend.  
- Authentication is required to access most features.  
- Use Postman or Insomnia for testing API endpoints if needed.  

---

## License
Specify your license here (e.g., MIT).
