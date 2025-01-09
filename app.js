const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 데이터 파일 경로
const DATA_FILE = path.join(__dirname, 'data.json');

// JSON 요청 파싱 및 정적 파일 제공
app.use(bodyParser.json());
app.use(express.static('public'));

// 파일에서 데이터 읽기
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// 파일에 데이터 저장
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// 소비 내역 조회
app.get('/api/expenses', (req, res) => {
  const expenses = readData();
  res.json(expenses);
});

// 소비 내역 추가
app.post('/api/expenses', (req, res) => {
  const { date, amount, category, memo } = req.body;

  if (!date || !amount || !category) {
    return res.status(400).json({ error: 'Date, amount, and category are required.' });
  }

  const expenses = readData();
  const newExpense = { id: Date.now(), date, amount, category, memo: memo || '' };
  expenses.push(newExpense);
  writeData(expenses);

  res.status(201).json(newExpense);
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/api/statistics', (req, res) => {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required.' });
    }
  
    const expenses = readData();
    const filteredExpenses = expenses.filter(expense => {
      const date = new Date(expense.date);
      return date.getFullYear() === parseInt(year) && date.getMonth() + 1 === parseInt(month);
    });
  
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
  
    res.json({
      totalAmount,
      categoryTotals,
      count: filteredExpenses.length,
    });
  });
  