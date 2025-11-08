-- Step 1: Create database
CREATE DATABASE expense_tracker;

-- Step 2: Connect to database (in psql, run: \c expense_tracker)

-- Step 3: Create expenses table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Add some sample data (optional)
INSERT INTO expenses (description, amount, category, date) VALUES
('Grocery shopping', 1200.00, 'Food', '2025-11-01'),
('Auto rickshaw', 80.00, 'Transportation', '2025-11-02'),
('Movie tickets', 500.00, 'Entertainment', '2025-11-05'),
('Electricity bill', 2500.00, 'Bills', '2025-11-06'),
('Chai and samosa', 50.00, 'Food', '2025-11-07');