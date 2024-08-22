import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as XLSX from 'xlsx';

export default function Home() {
  // State management
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'income',
    description: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Fetch transactions from Supabase
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data);
    }
  };

  const handleAddTransaction = async () => {
    const { amount, type, description } = newTransaction;

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ amount, type, description, created_at: new Date() }]);

    if (error) {
      console.error('Error adding transaction:', error);
    } else {
      setNewTransaction({ amount: '', type: 'income', description: '' });
      fetchTransactions();
    }
  };

  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    setEditMode(true);
  };

  const handleUpdateTransaction = async () => {
    const { id, amount, type, description } = currentTransaction;

    const { data, error } = await supabase
      .from('transactions')
      .update({
        amount,
        type,
        description,
        created_at: new Date()  // Update the date to current date/time
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating transaction:', error);
    } else {
      setEditMode(false);
      setCurrentTransaction(null);
      fetchTransactions();
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions.map(transaction => ({
      ID: transaction.id,
      Amount: formatCurrency(transaction.amount),
      Type: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
      Description: transaction.description,
      Date: new Date(transaction.created_at).toLocaleDateString('id-ID'),
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(file, 'transactions_report.xlsx');
  };

  const calculateTotalBalance = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' ? total + transaction.amount : total - transaction.amount;
    }, 0);
  };

  return (
    <div className="container">
      <h1>Financial Manager</h1>

      <div className="balance-section">
        <h2>Total Balance</h2>
        <div className="balance-amount">
          {formatCurrency(calculateTotalBalance())}
        </div>
      </div>

      <div className="form-section">
        {editMode ? (
          <>
            <h2>Edit Transaction</h2>
            <input
              type="number"
              placeholder="Amount"
              value={currentTransaction.amount}
              onChange={(e) =>
                setCurrentTransaction({
                  ...currentTransaction,
                  amount: parseFloat(e.target.value),
                })
              }
            />
            <select
              value={currentTransaction.type}
              onChange={(e) =>
                setCurrentTransaction({ ...currentTransaction, type: e.target.value })
              }
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="text"
              placeholder="Description"
              value={currentTransaction.description}
              onChange={(e) =>
                setCurrentTransaction({ ...currentTransaction, description: e.target.value })
              }
            />
            <div className="button-group">
              <button onClick={handleUpdateTransaction} className="button-primary">Update</button>
              <button onClick={() => setEditMode(false)} className="button-secondary">Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h2>Add New Transaction</h2>
            <input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  amount: parseFloat(e.target.value),
                })
              }
            />
            <select
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, type: e.target.value })
              }
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="text"
              placeholder="Description"
              value={newTransaction.description}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, description: e.target.value })
              }
            />
            <button onClick={handleAddTransaction} className="button-primary">Add Transaction</button>
          </>
        )}
      </div>

      <div className="table-title">
        <h3>Transaction History</h3>
        <button onClick={exportToExcel} className="button-primary">Export to Excel</button>
      </div>

      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <li key={transaction.id} className={`transaction-item ${transaction.type}`}>
            <div className="transaction-details">
              <span className="transaction-amount">
                {formatCurrency(transaction.amount)}
              </span>
              <span className="transaction-description">
                {transaction.description}
              </span>
              <span className="transaction-date">
                {new Date(transaction.created_at).toLocaleDateString('id-ID')}
              </span>
            </div>
            <button onClick={() => handleEditClick(transaction)} className="edit-button">Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}