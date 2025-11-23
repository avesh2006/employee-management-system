import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Check, X, Loader2 } from 'lucide-react';
import { leaveService } from '../services/api';

const Leave: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<any[]>([]);
    
    // Form State
    const [leaveType, setLeaveType] = useState('Vacation');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await leaveService.getLeaves();
            setRequests(response.data);
        } catch (error) {
            console.warn("Failed to fetch leaves, using fallback data");
            // Fallback for demo if backend is offline
            setRequests([
                { id: 1, type: 'Vacation', startDate: '2023-11-01', endDate: '2023-11-05', status: 'Approved', reason: 'Family trip' },
                { id: 2, type: 'Sick', startDate: '2023-10-15', endDate: '2023-10-16', status: 'Pending', reason: 'Flu' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await leaveService.requestLeave({ type: leaveType, startDate, endDate, reason });
            await fetchLeaves(); // Refresh list
            setShowModal(false);
            // Reset form
            setReason('');
            setStartDate('');
            setEndDate('');
        } catch (error) {
            alert("Failed to submit leave request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Leave Management</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                    <Plus size={18} className="mr-2"/> New Request
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {['Annual Leave', 'Sick Leave', 'Comp Off'].map((type, i) => (
                     <div key={i} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-teal-500">
                         <h3 className="text-gray-500 text-xs uppercase font-bold tracking-wider">{type}</h3>
                         <div className="flex items-end mt-2">
                             <span className="text-3xl font-bold text-gray-800">{10 + i}</span>
                             <span className="text-sm text-gray-400 mb-1 ml-1">/ 20 Days</span>
                         </div>
                     </div>
                 ))}
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-700 flex justify-between">
                    <span>Request History</span>
                    {loading && <Loader2 className="animate-spin text-blue-600" size={20} />}
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Dates</th>
                            <th className="px-6 py-3">Reason</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td className="px-6 py-3 font-medium">{req.type}</td>
                                <td className="px-6 py-3 text-gray-600">{req.startDate} to {req.endDate}</td>
                                <td className="px-6 py-3 text-gray-600 italic">"{req.reason}"</td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-400">
                                    {req.status === 'Pending' && <span className="text-red-500 hover:underline cursor-pointer">Cancel</span>}
                                </td>
                            </tr>
                        ))}
                        {!loading && requests.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No leave requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Request Leave</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Leave Type</label>
                                <select 
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                    className="w-full p-2 border rounded-lg bg-gray-50"
                                >
                                    <option value="Vacation">Vacation</option>
                                    <option value="Sick">Sick</option>
                                    <option value="Personal">Personal</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">From</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-gray-50" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">To</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-gray-50" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reason</label>
                                <textarea 
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full p-2 border rounded-lg bg-gray-50 h-20" 
                                    placeholder="Brief reason..."
                                ></textarea>
                            </div>
                            <button disabled={loading} className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leave;