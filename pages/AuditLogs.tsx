import React from 'react';
import { Download, Search, Filter } from 'lucide-react';

const AuditLogs: React.FC = () => {
    // Mock data
    const logs = Array.from({ length: 10 }).map((_, i) => ({
        id: `LOG-${1000 + i}`,
        user: i % 2 === 0 ? 'Admin User' : 'John Doe',
        action: i % 2 === 0 ? 'Approved Leave' : 'Checked In',
        timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
        ip: '192.168.1.' + (10 + i)
    }));

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">System Audit Logs</h2>
                    <p className="text-sm text-gray-500">Monitor all system activities and security events</p>
                </div>
                <div className="flex gap-2">
                     <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                        <Filter size={16} className="mr-2"/> Filter
                     </button>
                     <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                        <Download size={16} className="mr-2"/> Export CSV
                     </button>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
                    <input 
                        type="text" 
                        placeholder="Search logs by user, action or ID..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-600 font-semibold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Log ID</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">IP Address</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-mono text-gray-500">{log.id}</td>
                                <td className="px-6 py-3 font-medium text-gray-800">{log.user}</td>
                                <td className="px-6 py-3">
                                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                                        log.action.includes('Approved') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-600">{log.timestamp}</td>
                                <td className="px-6 py-3 text-gray-500 font-mono text-xs">{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-center">
                 <button className="text-sm text-blue-600 font-medium hover:underline">Load More Records</button>
            </div>
        </div>
    );
};

export default AuditLogs;
