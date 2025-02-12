import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const UserCreditReport = () => {
  const [transactions, setTransactions] = useState([]);
  const userEmail = JSON.parse(sessionStorage.getItem("user"))?.email || "Guest";

  useEffect(() => {
    fetchCreditTransactions();
  }, []);

  const fetchCreditTransactions = async () => {
    try {
      const response = await fetch(`http://localhost:3000/transactions/credit-transactions/${userEmail}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");

      const { data } = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar userEmail={userEmail} />
      <div className="main-content">
        <h3>Credit / Debit Report</h3>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              {/* <th>Email</th> */}
              <th>Transaction</th>
              <th>Amount</th>
              <th>Remaining Credits</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5">No transactions found.</td>
              </tr>
            ) : (
              transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{new Date(transaction.transactionDate).toLocaleString()}</td>
                  {/* <td>{transaction.userEmail}</td> */}
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.remainingCredits}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserCreditReport;
