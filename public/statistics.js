const monthForm = document.getElementById('month-form');
const totalAmountEl = document.getElementById('total-amount');
const categoryList = document.getElementById('category-list');

// Fetch and display statistics
const fetchStatistics = async (year, month) => {
  const response = await fetch(`/api/statistics?year=${year}&month=${month}`);
  if (!response.ok) {
    alert('Error fetching statistics');
    return;
  }

  const { totalAmount, categoryTotals } = await response.json();

  // Update total amount
  totalAmountEl.textContent = `$${totalAmount}`;

  // Update category breakdown
  categoryList.innerHTML = '';
  for (const [category, amount] of Object.entries(categoryTotals)) {
    const li = document.createElement('li');
    li.textContent = `${category}: $${amount}`;
    categoryList.appendChild(li);
  }
};

// Handle form submission
monthForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const year = document.getElementById('year').value;
  const month = document.getElementById('month').value;

  if (year && month) {
    fetchStatistics(year, month);
  } else {
    alert('Please enter a valid year and month.');
  }
});
