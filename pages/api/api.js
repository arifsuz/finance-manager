const handleUpdateTransaction = async () => {
  const { id, amount, type, description } = currentTransaction;

  // Update the transaction with the new data and current date
  const { data, error } = await supabase
    .from("transactions")
    .update({
      amount,
      type,
      description,
      created_at: new Date(), // Update the date to current date/time
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating transaction:", error);
  } else {
    setEditMode(false);
    setCurrentTransaction(null);
    fetchTransactions(); // Refresh the transaction list
  }
};
