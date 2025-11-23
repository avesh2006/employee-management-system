import React, { useEffect, useState } from 'react';
import { Download, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { salaryService } from '../services/api';

const Salary: React.FC = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [breakdown, setBreakdown] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [histRes, breakRes] = await Promise.all([
                    salaryService.getHistory(),
                    salaryService.getBreakdown()
                ]);
                setHistory(histRes.data);
                setBreakdown(breakRes.data);
            } catch (err) {
                console.warn("Backend unavailable, using mock salary data");
                setHistory([
                    { month: 'Jan', net: 4000, bonus: 200 },
                    { month: 'Feb', net: 4000, bonus: 0 },
                    { month: 'Mar', net: 4100, bonus: 500 },
                    { month: 'Apr', net: 4100, bonus: 0 },
                    { month: 'May', net: 4100, bonus: 0 },
                    { month: 'Jun', net: 4200, bonus: 1000 },
                ]);
                setBreakdown({
                    base: 3500,
                    hra: 1200,
                    allowance: 800,
                    tax: 450,
                    pf: 200,
                    net: 4850
                });
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Salary & Payroll</h2>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
                    <Download size={18} className="mr-2"/> Download Slip
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-blue-200 text-sm font-medium uppercase">Total Earnings (YTD)</p>
                    <h3 className="text-3xl font-bold mt-2">$32,450.00</h3>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium uppercase">Last Month Net</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">${breakdown?.net || '0.00'}</h3>
                    <p className="text-green-500 text-xs mt-1 flex items-center"><TrendingUp size={12} className="mr-1"/> +2.4% vs prev</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium uppercase">Deductions</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">${((breakdown?.tax || 0) + (breakdown?.pf || 0)) || '0.00'}</h3>
                    <p className="text-gray-400 text-xs mt-1">Tax & Insurance</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">Income Trend</h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={history}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="net" fill="#3b82f6" stackId="a" />
                              <Bar dataKey="bonus" fill="#10b981" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Latest Breakdown</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Basic Salary</span>
                            <span className="font-medium">${breakdown?.base}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">HRA</span>
                            <span className="font-medium">${breakdown?.hra}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Special Allowance</span>
                            <span className="font-medium">${breakdown?.allowance}</span>
                        </div>
                        <div className="border-t border-dashed border-gray-200 my-2"></div>
                        <div className="flex justify-between text-sm text-red-500">
                            <span>Tax Deduction</span>
                            <span>-${breakdown?.tax}</span>
                        </div>
                        <div className="flex justify-between text-sm text-red-500">
                            <span>Provident Fund</span>
                            <span>-${breakdown?.pf}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                             <div className="flex justify-between font-bold text-lg text-gray-800">
                                <span>Net Pay</span>
                                <span>${breakdown?.net}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Salary;