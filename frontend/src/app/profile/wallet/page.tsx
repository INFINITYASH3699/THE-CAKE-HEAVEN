'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FiCreditCard, FiGift, FiArrowUp, FiArrowDown } from 'react-icons/fi';

// Define Transaction interface
interface Transaction {
  amount: number;
  description: string;
  date: string;
}

// Define Wallet interface
interface Wallet {
  balance: number;
  history: Transaction[];
}

// Define a type for grouped transactions
interface GroupedTransactions {
  [date: string]: Transaction[];
}

const WalletPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const wallet = user?.wallet as Wallet | undefined;

  if (!wallet) {
    return (
      <div className="text-center py-8">
        <p>Loading wallet information...</p>
      </div>
    );
  }

  // Group transactions by date for better organization
  const groupedTransactions = wallet.history
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reduce<GroupedTransactions>((groups, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">My Wallet</h2>

      <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white p-6 mb-8">
        <div className="flex items-center mb-4">
          <FiCreditCard className="h-6 w-6 mr-2" />
          <h3 className="text-lg font-medium">Wallet Balance</h3>
        </div>
        <div className="text-3xl font-bold mb-1">₹{wallet.balance.toFixed(2)}</div>
        <p className="text-pink-100">Use your balance to get discounts on orders</p>
        <div className="mt-4 flex space-x-4">
          <button className="bg-white text-pink-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-50 transition">
            Add Money
          </button>
          <button className="bg-transparent border border-white text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition">
            Redeem Gift Card
          </button>
        </div>
      </div>

      <div className="bg-pink-50 p-4 rounded-lg mb-8">
        <div className="flex items-center text-pink-700">
          <FiGift className="h-5 w-5 mr-2" />
          <p className="text-sm">
            <span className="font-medium">Did you know?</span> You can earn wallet points with every order, and use them on your next purchase!
          </p>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-800 mb-4">Transaction History</h3>

      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, transactions]) => (
            <div key={date}>
              <h4 className="text-sm font-medium text-gray-500 mb-2">{date}</h4>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className={`p-4 flex items-center justify-between ${
                      index !== transactions.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {transaction.amount > 0 ? (
                          <FiArrowDown className="h-5 w-5" />
                        ) : (
                          <FiArrowUp className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-800">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">How it Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-3">
              1
            </div>
            <h4 className="font-medium mb-2">Earn Points</h4>
            <p className="text-sm text-gray-600">Get points with every purchase. 5% of your order value is credited to your wallet.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-3">
              2
            </div>
            <h4 className="font-medium mb-2">Redeem Points</h4>
            <p className="text-sm text-gray-600">Use your wallet balance during checkout to get discounts on your orders.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-3">
              3
            </div>
            <h4 className="font-medium mb-2">Referral Bonus</h4>
            <p className="text-sm text-gray-600">Invite friends and get ₹100 in your wallet when they make their first purchase.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;