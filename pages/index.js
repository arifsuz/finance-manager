import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

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


  return (
    <div style={{ padding: '20px' }}>
      <h1>Financial Manager</h1>
      <h2>Total Savings: {formatCurrency(totalSavings)}</h2>

      <div style={{ marginBottom: '20px' }}>
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

      <h2>Transaction History</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <strong>{transaction.type === 'income' ? '+' : '-'}</strong> {formatCurrency(transaction.amount)} - {transaction.description} (on {new Date(transaction.created_at).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}