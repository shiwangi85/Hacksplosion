import { Blocks, Shield, Clock, Database, Lock, Globe } from 'lucide-react';
import ExternalWebsite from './ExternalWebsite';
// import MapComponent from './MapComponent';

const transactions = [
  {
    id: '2',
    type: 'Vehicle Registration',
    hash: '0x3e8b...9c2d',
    timestamp: '15 minutes ago',
    status: 'Confirmed'
  }
];

export default function Blockchain() {
  return (
    <div className="space-y-6 p-8 bg-gray-900 h-55 border-r-2">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-800 via-purple-700 to-purple-500 text-transparent bg-clip-text font-serif">
          Blockchain Ledger
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Secure, Transparent, and Tamper-Proof Transactions
        </p>
      </div>

      {/* Blockchain Stats Section */}
      <div className="grid grid-cols-3 gap-6 text-center">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <Database className="w-12 h-12 text-blue-400 mx-auto mb-2" />
          <h3 className="text-white font-semibold">Total Transactions</h3>
          <p className="text-2xl font-bold text-blue-400">1,245</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <Lock className="w-12 h-12 text-green-400 mx-auto mb-2" />
          <h3 className="text-white font-semibold">Security Level</h3>
          <p className="text-2xl font-bold text-green-400">High 🔒</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <Globe className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
          <h3 className="text-white font-semibold">Latest Block</h3>
          <p className="text-2xl font-bold text-yellow-400">#125,874</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="grid gap-6">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md transition-transform transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Blocks className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-white">{tx.type}</h3>
                  <p className="text-sm text-gray-400">{tx.hash}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{tx.timestamp}</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Shield className="w-4 h-4" />
                  <span>{tx.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
