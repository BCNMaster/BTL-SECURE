import React, { useState } from 'react';
import { Transaction } from '../types/wallet';
import { ArrowUpDown, Check, X, Loader2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onViewDetails?: (transaction: Transaction) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onViewDetails
}) => {
  const [filter, setFilter] = useState('all'); // all, sent, received
  const [sortBy, setSortBy] = useState('date'); // date, amount, status
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <X className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getTransactionType = (transaction: Transaction, currentAddress: string) => {
    return transaction.from.toLowerCase() === currentAddress.toLowerCase()
      ? 'sent'
      : 'received';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getExplorerUrl = (transaction: Transaction) => {
    switch (transaction.network) {
      case 'ethereum':
        return `https://etherscan.io/tx/${transaction.hash}`;
      case 'solana':
        return `https://explorer.solana.com/tx/${transaction.hash}`;
      default:
        return '';
    }
  };

  const filteredTransactions = transactions
    .filter(tx => {
      if (filter === 'all') return true;
      return getTransactionType(tx, 'YOUR_ADDRESS') === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc'
          ? b.timestamp - a.timestamp
          : a.timestamp - b.timestamp;
      }
      // Add other sort methods as needed
      return 0;
    });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <select
            className="rounded-lg border p-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="sent">Sent</option>
            <option value="received">Received</option>
          </select>

          <select
            className="rounded-lg border p-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="status">Status</option>
          </select>

          <button
            className="p-2 rounded-lg border"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.hash}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onViewDetails?.(transaction)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction.status)}
                    <span className="font-medium">
                      {getTransactionType(transaction, 'YOUR_ADDRESS') === 'sent' ? 'Sent to' : 'Received from'}
                    </span>
                    <span className="font-mono">
                      {formatAddress(getTransactionType(transaction, 'YOUR_ADDRESS') === 'sent'
                        ? transaction.to
                        : transaction.from
                      )}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(transaction.timestamp, 'MMM d, yyyy HH:mm')}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium">
                    {getTransactionType(transaction, 'YOUR_ADDRESS') === 'sent' ? '-' : '+'}
                    {transaction.value} {transaction.network.toUpperCase()}
                  </div>
                  <a
                    href={getExplorerUrl(transaction)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-600 flex items-center justify-end space-x-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>View on Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;