Node.js Developer Test Task (Omno psp Task)

This is a Payment Gateway simulation built with Fastify, TypeScript, and PostgreSQL. It includes a built-in PSP (Payment Service Provider) simulator to handle full payment lifecycles, including 3DS redirects and asynchronous webhooks.

How to Start the App
1. Prerequisites
Node.js (v18 or higher)

PostgreSQL database

npm or yarn

2. Environment Setup
Create a .env file in the root directory and fill in your database details:

Code snippet
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=your_database_name

3. Database Preparation
Run the following SQL command in your database to create the required table:

SQL
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    psp_id UUID,
    amount NUMERIC,
    currency VARCHAR(10),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

4. Installation & Execution
Bash
# Install dependencies
npm install

# Run the server in development mode
npm run dev
The server will be available at http://localhost:3000. You can view the API documentation at http://localhost:3000/docs.

🧪 How to Run Tests
The project uses Jest for unit and integration testing.

Bash
# Run all tests once
npm test
