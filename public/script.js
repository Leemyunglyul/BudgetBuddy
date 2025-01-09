const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');

// Fetch and display expenses
const fetchExpenses = async () => {
  const response = await fetch('/api/expenses');
  const expenses = await response.json();

  expenseList.innerHTML = '';
  expenses.forEach(expense => {
    const li = document.createElement('li');
    li.textContent = `${expense.date} - $${expense.amount} [${expense.category}] ${expense.memo}`;
    expenseList.appendChild(li);
  });
};

// Add new expense
expenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;
  const memo = document.getElementById('memo').value;

  const newExpense = { date, amount, category, memo };
  await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newExpense),
  });

  fetchExpenses();
  expenseForm.reset();
});

// Initial fetch
fetchExpenses();
