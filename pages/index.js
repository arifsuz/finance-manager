import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as XLSX from 'xlsx';

export default function Home() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);

  // Fetch transactions when the component mounts
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Function to fetch transactions from Supabase
  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data);
      calculateTotalSavings(data);
    }
  };

  // Calculate total savings from transactions
  const calculateTotalSavings = (transactions) => {
    const total = transactions.reduce((acc, transaction) => {
      return transaction.type === 'income'
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);
    setTotalSavings(total);
  };

  // Function to handle adding a new transaction
  const handleAddTransaction = async () => {
    if (!amount || !description) {
      alert('Please fill in all fields');
      return;
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ amount, type, description }]);

    if (error) {
      console.error('Error adding transaction:', error);
    } else {
      fetchTransactions();
      setAmount('');
      setDescription('');
    }
  };

  // Function to format numbers as currency in IDR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  // Function to convert transactions to Excel and download
  const handleDownloadExcel = () => {
    const formattedTransactions = transactions.map((transaction) => ({
      ID: transaction.id,
      Amount: transaction.amount,
      Type: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
      Description: transaction.description,
      Date: new Date(transaction.created_at).toLocaleDateString('id-ID'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedTransactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    XLSX.writeFile(workbook, `Transactions_Report_${new Date().toLocaleDateString('id-ID')}.xlsx`);
  };

  return (
    <div className="container">
      <h1>Financial Manager</h1>

      <div className="summary">
        <h2>Total Savings</h2>
        <p className="total-savings">{formatCurrency(totalSavings)}</p>
      </div>

      <div className="form-section">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAddTransaction}>Add Transaction</button>
      </div>

      <button onClick={handleDownloadExcel} className="download-button">
        Download Report as Excel
      </button>

      <h2>Transaction History</h2>
      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <li key={transaction.id} className={`transaction-item ${transaction.type}`}>
            <span className="transaction-amount">{formatCurrency(transaction.amount)}</span>
            <span className="transaction-description">{transaction.description}</span>
            <span className="transaction-date">{new Date(transaction.created_at).toLocaleDateString('id-ID')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}