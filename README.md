# 💰 Expense Tracker - India Edition

A **super simple** expense tracker for beginners. Track your daily expenses in **INR (₹)**.

Built with: Node.js + Express + PostgreSQL + Bootstrap

---

## 📦 What You Need

1. **Node.js** - [Download here](https://nodejs.org/) (Get the LTS version)
2. **PostgreSQL** - [Download here](https://www.postgresql.org/download/)

That's it!

---

## 🚀 How to Run (5 Simple Steps)

### Step 1: Download the Code

Download this project or clone it:

```bash
git clone https://github.com/ObaidAbdullah16/expense-tracker.git
cd expense-tracker
```

### Step 2: Install Packages

Open terminal/command prompt in the project folder and run:

```bash
npm install
```

### Step 3: Create Database

1. Open PostgreSQL (pgAdmin or command line)
2. Run these commands one by one:

```sql
CREATE DATABASE expense_tracker;
```

3. Connect to the database:

```sql
\c expense_tracker
```

4. Create the table (copy from `database.sql` file):

```sql
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 4: Update Database Password

Open `server.js` file and change this line (around line 15):

```javascript
password: 'yourpassword',      // Put your actual PostgreSQL password here
```

### Step 5: Start the Server

```bash
npm start
```

Open your browser and go to: **http://localhost:3000**

Done! 🎉

---

## 🌐 How to Deploy on AWS EC2

### Quick Steps:

1. **Create EC2 Instance**

   - Choose Ubuntu 22.04
   - Instance type: t2.micro (free tier)
   - Security group: Open ports 22, 80, and 3000

2. **Connect to EC2**

   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Node.js**

   ```bash
   sudo apt update
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

4. **Install PostgreSQL**

   ```bash
   sudo apt install postgresql postgresql-contrib -y
   sudo systemctl start postgresql
   ```

5. **Setup Database**

   ```bash
   sudo -u postgres psql
   CREATE DATABASE expense_tracker;
   CREATE USER myuser WITH PASSWORD 'mypassword';
   GRANT ALL PRIVILEGES ON DATABASE expense_tracker TO myuser;
   \c expense_tracker
   -- Paste CREATE TABLE command here
   \q
   ```

6. **Upload Your Code**

   ```bash
   git clone https://github.com/ObaidAbdullah16/expense-tracker.git
   cd expense-tracker
   npm install
   ```

7. **Edit server.js** (change database password)

   ```bash
   nano server.js
   # Change the password line
   # Save: Ctrl+X, then Y, then Enter
   ```

8. **Run Forever**

   ```bash
   sudo npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

9. **Access Your Site**
   ```
   http://your-ec2-ip:3000
   ```

---

## 📁 Files Explained

- **server.js** - Main server file (all backend code here!)
- **database.sql** - Database setup commands
- **public/index.html** - Website page
- **public/script.js** - Frontend JavaScript
- **public/style.css** - Styling
- **package.json** - Dependencies list

---

## 💡 Features

✅ Add expenses with description, amount, category, date  
✅ View all expenses in a table  
✅ See total expenses in INR (₹)  
✅ Beautiful gradient design  
✅ Different colors for different categories  
✅ Indian date format (DD/MM/YYYY)

---

## 🔧 Common Issues

**"Database connection failed"**

- Check if PostgreSQL is running
- Check username and password in `server.js`

**"Port 3000 already in use"**

- Change PORT in `server.js` (line 8) to something else like 3001

**Can't access on EC2**

- Make sure security group has port 3000 open
- Use public IP, not private

---

## 📝 Made By

**ObaidAbdullah16**

GitHub: [@ObaidAbdullah16](https://github.com/ObaidAbdullah16)

---

## 🙏 Notes

- This is a beginner-friendly project
- Everything is kept simple on purpose
- Perfect for learning Node.js + PostgreSQL
- Currency: Indian Rupees (₹)

**Happy tracking! 🇮🇳💰**
