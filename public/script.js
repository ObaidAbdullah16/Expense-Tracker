// Get form and table elements
const form = document.getElementById("expense-form");
const table = document.getElementById("expenses-table");
const totalElement = document.getElementById("total-amount");

// Set today's date as default
document.getElementById("date").valueAsDate = new Date();

// Load expenses when page loads
loadExpenses();

// When form is submitted
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get values from form
  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  // Create expense object
  const expense = { description, amount, category, date };

  try {
    // Send to server
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });

    if (response.ok) {
      form.reset();
      document.getElementById("date").valueAsDate = new Date();
      loadExpenses();
      alert("✅ Expense added!");
    } else {
      alert("❌ Failed to add expense");
    }
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
});

// Load all expenses from database
async function loadExpenses() {
  try {
    const response = await fetch("/api/expenses");
    const expenses = await response.json();

    table.innerHTML = "";

    if (expenses.length === 0) {
      table.innerHTML =
        '<tr><td colspan="4" class="text-center">No expenses yet!</td></tr>';
      totalElement.textContent = "0.00";
      return;
    }

    let total = 0;

    expenses.forEach((expense) => {
      const row = document.createElement("tr");
      const date = new Date(expense.date).toLocaleDateString("en-IN");

      // Different colors for different categories
      let badgeColor = "bg-secondary";
      if (expense.category === "Food") badgeColor = "bg-success";
      if (expense.category === "Transportation") badgeColor = "bg-primary";
      if (expense.category === "Entertainment") badgeColor = "bg-warning";
      if (expense.category === "Bills") badgeColor = "bg-danger";
      if (expense.category === "Shopping") badgeColor = "bg-info";

      row.innerHTML = `
        <td>${date}</td>
        <td>${expense.description}</td>
        <td><span class="badge ${badgeColor}">${expense.category}</span></td>
        <td><strong>₹${parseFloat(expense.amount).toFixed(2)}</strong></td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteExpense(${
            expense.id
          }, '${expense.description}')">
            Delete
          </button>
        </td>
      `;

      table.appendChild(row);
      total += parseFloat(expense.amount);
    });

    // Update total with Indian number format
    totalElement.textContent = total.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    table.innerHTML =
      '<tr><td colspan="5" class="text-center text-danger">Failed to load expenses</td></tr>';
  }
}

// Delete single expense function
async function deleteExpense(id, description) {
  if (confirm(`Delete "${description}"?`)) {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Deleted successfully");
        loadExpenses(); // Reload the list
        alert("✅ Expense deleted!");
      } else {
        console.error("Delete failed");
        alert("❌ Failed to delete");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error: " + error.message);
    }
  }
}

// Delete all expenses
const deleteAllBtn = document.getElementById("delete-all-btn");
if (deleteAllBtn) {
  deleteAllBtn.addEventListener("click", async () => {
    if (confirm("⚠️ Delete ALL expenses?")) {
      try {
        const response = await fetch("/api/expenses", {
          method: "DELETE",
        });

        if (response.ok) {
          loadExpenses();
          alert("✅ All expenses deleted!");
        } else {
          alert("❌ Failed to delete all");
        }
      } catch (error) {
        alert("❌ Error: " + error.message);
      }
    }
  });
}
