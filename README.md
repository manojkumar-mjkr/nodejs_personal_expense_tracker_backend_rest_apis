# 📒 Personal Expense Tracker API

A backend API for managing personal income, expenses, and budgets. Built using **Node.js**, **Express**, and **MySQL** with **JWT-based authentication** and **raw SQL queries**.

---

## 📂 Tech Stack

- **Node.js + Express** – Backend framework
- **MySQL** – Relational database
- **JWT** – Authentication (access & refresh tokens)
- **mysql2** – DB interaction with raw SQL
- **dotenv** – For environment variable management

---

## 📁 Project Structure

/expense-tracker/
├── controllers/ # Route handlers
├── models/ # Query logic (raw SQL)
├── routes/ # Express route definitions
├── middleware/ # Auth, error handling
├── utils/ # Reusable helper functions
│ └── responseFormatter.js
├── config/ # DB configuration
├── app.js # App entry point
└── .env # Environment variables


---

## 🧾 Features

- 🔐 User registration & login with JWT
- 💸 Record income & expenses
- 📊 Monthly and yearly summaries
- 🎯 Categorized spending (e.g., food, rent, salary)
- 🛡️ Role-based route protection (planned)
- 🗂️ Clean code separation with modular design

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/expense-tracker-api.git
cd expense-tracker-api
2. Install Dependencies
bash
npm install
3. Create .env File
env

PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=expense_tracker

JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_key
4. Create Database Tables
Use the provided SQL files or follow table creation scripts for:

users

cash_flow

income_category

expense_category

expense_tracking

5. Start the Server
npm start

📬 API Endpoints Overview
🔐 Auth
POST /api/register

POST /api/login

💼 Cash Flow Types
GET /api/cash-flows

🧾 Categories
GET /api/expense-categories

GET /api/income-categories

📥 Transactions
POST /api/transactions

GET /api/transactions

GET /api/transactions/:id

PUT /api/transactions/:id

DELETE /api/transactions/:id

📊 Summary (Planned)
GET /api/summary/monthly

GET /api/summary/yearly

🧪 Sample .env
env

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=expense_tracker
JWT_SECRET=mySecret
JWT_REFRESH_SECRET=myRefreshSecret
✅ To-Do / Future Enhancements
 Add export to Excel/PDF

 Add user-specific budgets with limits

 Add multi-currency support

 Add recurring income/expense tracking

 Add unit tests with Jest

🙌 Contribution
PRs are welcome! For major changes, please open an issue first.

📄 License
MIT License
