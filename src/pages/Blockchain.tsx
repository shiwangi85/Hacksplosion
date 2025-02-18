import { Blocks, Shield, Clock } from 'lucide-react';
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-400">Blockchain Ledger</h1>

    {/* <MapComponent/> */}
      <div className="grid gap-6">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
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

