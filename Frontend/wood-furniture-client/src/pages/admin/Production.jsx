import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const Production = () => {
  return (
    <AdminLayout>

    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Production Batches</h1>
        <button className="bg-primary-800 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          + New Batch
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase">
            <tr>
              <th className="p-4">Batch ID</th>
              <th className="p-4">Product</th>
              <th className="p-4 text-center">Type</th>
              <th className="p-4 text-center">Qty</th>
              <th className="p-4">Start Date</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              {id: 'B-1005', product: 'Dining Table', type: 'Stock', qty: 20, date: 'May 12, 2024', status: 'In Progress'},
              {id: 'B-1004', product: 'Solid Oak Chair', type: 'Stock', qty: 30, date: 'May 10, 2024', status: 'In Progress'},
              {id: 'B-1003', product: 'Custom Cabinet', type: 'Custom', qty: 1, date: 'May 08, 2024', status: 'Completed'},
            ].map((batch, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{batch.id}</td>
                <td className="p-4 text-gray-600">{batch.product}</td>
                <td className="p-4 text-center text-gray-600">{batch.type}</td>
                <td className="p-4 text-center text-gray-900 font-medium">{batch.qty}</td>
                <td className="p-4 text-gray-600">{batch.date}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${batch.status==='Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {batch.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </AdminLayout>
  );
};
export default Production;
