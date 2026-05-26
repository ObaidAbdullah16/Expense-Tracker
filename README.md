# 💰 Expense Tracker

A simple and efficient web application to track your daily expenses, manage budgets, and visualize spending patterns.

## 🌐 Live Demo

👉 **[View Live Application](https://expense.obaidinfo.xyz)**

---

## 📋 Features

✅ Add expenses with description, amount, category, date  
✅ View all expenses in a table  
✅ See total expenses in INR (₹)  
✅ Beautiful gradient design  
✅ Different colors for different categories  
✅ Indian date format (DD/MM/YYYY)
✅ Real-time expense calculations
✅ Local storage for data persistence

## 🛠️ Technologies Used

- **Frontend:**
  - HTML5
  - CSS3 (Responsive Design)
  - JavaScript (ES6+)
  - Node.js + Express
  - PostgreSQL
  
- **Hosting:**
  - AWS EC2
  - PM2 (Process Manager)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/ObaidAbdullah16/Expense-Tracker.git
cd Expense-Tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create PostgreSQL database:
```sql
CREATE DATABASE expense_tracker;
```

4. Create table:
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

5. Update database connection in `server.js`

6. Start the server:
```bash
npm start
```

7. Visit: `http://localhost:3000`

## 🚀 Usage

1. **Add Expense:**
   - Click "Add Expense" button
   - Enter amount, category, and description
   - Click "Add" to save

2. **View Dashboard:**
   - See total expenses
   - View monthly breakdown
   - Check category-wise spending

3. **Manage Expenses:**
   - Edit: Click the edit icon
   - Delete: Click the delete icon
   - Filter: Use date or category filters

4. **Export Data:**
   - Download expense report as CSV
   - Print monthly summary

## 📊 Project Structure

```
Expense-Tracker/
├── server.js          # Main server file
├── database.sql       # Database setup
├── package.json       # Dependencies
├── public/
│   ├── index.html     # Main HTML
│   ├── style.css      # Styling
│   └── script.js      # Frontend logic
└── README.md
```

## 🌐 Deployment on AWS EC2

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
   ```

6. **Upload Your Code**
   ```bash
   git clone https://github.com/ObaidAbdullah16/Expense-Tracker.git
   cd Expense-Tracker
   npm install
   ```

7. **Run with PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

8. **Access Your Site**
   ```
   http://your-ec2-ip:3000
   ```

## 🔧 Common Issues

**"Database connection failed"**
- Check if PostgreSQL is running
- Check username and password in `server.js`

**"Port 3000 already in use"**
- Change PORT in `server.js` to something else like 3001

**Can't access on EC2**
- Make sure security group has port 3000 open
- Use public IP, not private

## 🐛 Known Issues

None currently. If you find any bugs, please [report them](https://github.com/ObaidAbdullah16/Expense-Tracker/issues).

## 📝 Future Enhancements

- [ ] Cloud synchronization
- [ ] Mobile app version
- [ ] Budget alerts
- [ ] Recurring expenses
- [ ] Multi-currency support
- [ ] Advanced analytics
- [ ] Dark mode

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Obaid Abdullah**
- GitHub: [@ObaidAbdullah16](https://github.com/ObaidAbdullah16)
- Portfolio: [obaidinfo.xyz](https://obaidinfo.xyz)
- Expense Tracker: [expense.obaidinfo.xyz](https://expense.obaidinfo.xyz)

## 📞 Support

If you encounter any issues or have questions:
- Open an [Issue](https://github.com/ObaidAbdullah16/Expense-Tracker/issues)
- Check [Discussions](https://github.com/ObaidAbdullah16/Expense-Tracker/discussions)
- Visit my [Portfolio](https://obaidinfo.xyz)

## ⭐ Show Your Support

Give a ⭐️ if you found this project helpful!

---

**Last Updated:** May 26, 2026
