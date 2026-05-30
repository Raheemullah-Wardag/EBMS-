import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllBatches, updateBatchStatus, allocateMaterials } from '../../api/productionApi';
import { getAllRawMaterials } from '../../api/materialApi';
import { Eye, X } from 'lucide-react';

const Production = () => {
  const [batches, setBatches] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [allocateModal, setAllocateModal] = useState(false);
  const [allocations, setAllocations] = useState({});
  const [allocating, setAllocating] = useState(false);

  useEffect(() => {
    fetchBatches();
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await getAllRawMaterials();
      setMaterials(response.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
    }
  };

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await getAllBatches();
      setBatches(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch production batches');
      console.error('Error fetching batches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateClick = (batch) => {
    setSelected(batch);
    setAllocations({});
    setAllocateModal(true);
  };

  const handleAllocationToggle = (materialID) => {
    setAllocations(prev => ({
      ...prev,
      [materialID]: prev[materialID] ? undefined : { materialID, qtyUsed: 0 }
    }));
  };

  const handleAllocationQty = (materialID, qty) => {
    setAllocations(prev => ({
      ...prev,
      [materialID]: { materialID, qtyUsed: parseFloat(qty) || 0 }
    }));
  };

  const handleSubmitAllocations = async (e) => {
    e.preventDefault();
    setAllocating(true);
    try {
      const selectedMaterials = Object.values(allocations).filter(m => m && m.qtyUsed > 0);
      if (selectedMaterials.length === 0) {
        setError('Please select at least one material with quantity.');
        setAllocating(false);
        return;
      }

      await allocateMaterials({
        batchID: selected.batchID,
        materials: selectedMaterials
      });
      setAllocateModal(false);
      setError(null);
      fetchBatches();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to allocate materials');
    } finally {
      setAllocating(false);
    }
  };

  const handleStatusUpdate = async (batchId, newStatus) => {
    try {
      await updateBatchStatus(batchId, {
        newStatus: newStatus,
        quantityMade: 0
      });
      fetchBatches();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update batch status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout  title="Production Batches">
      <div className="animate-fade-in">
        

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Allocate Materials Modal */}
        {allocateModal && selected && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setAllocateModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Allocate Materials to Batch {selected.batchID}
              </h2>
              <p className="text-sm text-gray-600 mb-6">{selected.batchName}</p>

              <form onSubmit={handleSubmitAllocations} className="space-y-4">
                {/* Materials List with Checkboxes */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 max-h-96 overflow-y-auto">
                  {materials.length === 0 ? (
                    <p className="text-gray-500 text-sm">No raw materials available</p>
                  ) : (
                    materials.map(material => {
                      const isSelected = allocations[material.materialID];
                      return (
                        <div key={material.materialID} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 hover:border-amber-300">
                          <input
                            type="checkbox"
                            checked={!!isSelected}
                            onChange={() => handleAllocationToggle(material.materialID)}
                            className="w-5 h-5 rounded border-gray-300 text-amber-600 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">{material.materialName}</p>
                            <p className="text-xs text-gray-500">Stock: {material.stockQty} {material.unit}</p>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max={material.stockQty}
                                value={isSelected.qtyUsed}
                                onChange={e => handleAllocationQty(material.materialID, e.target.value)}
                                className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                                placeholder="Qty"
                              />
                              <span className="text-sm text-gray-600 whitespace-nowrap">{material.unit}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setAllocateModal(false)}
                    className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={allocating}
                    className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50"
                  >
                    {allocating ? 'Allocating...' : 'Confirm Allocation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">Batch ID</th>
                    <th className="py-4 px-6 font-semibold">Batch Name</th>
                    <th className="py-4 px-6 font-semibold">Assigned To</th>
                    <th className="py-4 px-6 font-semibold">Start Date</th>
                    <th className="py-4 px-6 font-semibold">End Date</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {batches.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-gray-400">
                        No production batches found
                      </td>
                    </tr>
                  ) : (
                    batches.map((batch) => (
                      <tr key={batch.batchID} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6 font-semibold text-gray-900">B-{batch.batchID.toString().padStart(4, '0')}</td>
                        <td className="py-4 px-6 text-gray-700">{batch.batchName}</td>
                        <td className="py-4 px-6 text-gray-600">{batch.assignedToName || 'Unassigned'}</td>
                        <td className="py-4 px-6 text-gray-600">{formatDate(batch.startDate)}</td>
                        <td className="py-4 px-6 text-gray-600">{formatDate(batch.endDate)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(batch.status)}`}>
                            {batch.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelected(batch);
                              }}
                              className="text-amber-600 hover:text-amber-800 text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-amber-50 transition"
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              onClick={() => handleAllocateClick(batch)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition border border-blue-200"
                            >
                              Allocate
                            </button>
                            <select
                              value={batch.status}
                              onChange={e => handleStatusUpdate(batch.batchID, e.target.value)}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                            >
                              <option value="">Update Status</option>
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Production;
