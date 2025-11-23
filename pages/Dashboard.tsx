import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { dashboardService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, AlertCircle, Trophy, Star, CalendarCheck, Banknote } from 'lucide-react';

const MOCK_ATTENDANCE = [
  { name: 'Mon', present: 40, late: 2 },
  { name: 'Tue', present: 42, late: 1 },
  { name: 'Wed', present: 38, late: 5 },
  { name: 'Thu', present: 41, late: 2 },
  { name: 'Fri', present: 39, late: 4 },
];

const MOCK_LEAVE = [
  { name: 'Sick', value: 12 },
  { name: 'Vacation', value: 18 },
  { name: 'Personal', value: 5 },
];

const COLORS = ['#ef4444', '#3b82f6', '#10b981'];

const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4" style={{ borderColor: color }}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
      </div>
      <div className="p-3 rounded-full bg-gray-50 text-gray-600">
        <Icon size={24} style={{ color }} />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
      totalEmployees: '142',
      attendanceRate: '94%',
      onLeave: '8',
      payroll: '$842k'
  });
  const [attendanceData, setAttendanceData] = useState(MOCK_ATTENDANCE);

  useEffect(() => {
    // Fetch real data from backend
    const fetchData = async () => {
        try {
            const [statsRes, trendsRes] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getAttendanceTrends()
            ]);
            setStats(statsRes.data);
            setAttendanceData(trendsRes.data);
        } catch (error) {
            console.log("Using mock dashboard data (Backend unavailable)");
        }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value={stats.totalEmployees} subtitle="+4 this month" icon={Users} color="#3b82f6" />
        <StatCard title="Attendance Rate" value={stats.attendanceRate} subtitle="Daily Average" icon={Clock} color="#10b981" />
        <StatCard title="On Leave" value={stats.onLeave} subtitle="Today" icon={AlertCircle} color="#f59e0b" />
        <StatCard title="Payroll Output" value={stats.payroll} subtitle="Last Month" icon={TrendingUp} color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Attendance Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Leave Distribution</h3>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_LEAVE}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_LEAVE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 text-sm text-gray-600 mt-2">
             <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Sick</span>
             <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span> Vacation</span>
             <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span> Personal</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Recent Audit Logs</h3>
          <button className="text-blue-600 text-sm hover:underline">View All</button>
        </div>
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-6 py-3">Jane Smith</td>
              <td className="px-6 py-3">Approved Leave Request #402</td>
              <td className="px-6 py-3">10 mins ago</td>
            </tr>
            <tr>
              <td className="px-6 py-3">System</td>
              <td className="px-6 py-3">Auto-checkout User #882</td>
              <td className="px-6 py-3">1 hour ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmployeeDashboard = ({ user }: { user: any }) => {
  const nextLevelXp = user.level * 500;
  const progress = (user.xp / nextLevelXp) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
               <div className="relative">
                 <img src={user.avatarUrl} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white/30" />
                 <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full border border-white">
                   Lvl {user.level}
                 </div>
               </div>
               <div className="ml-4">
                 <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
                 <p className="text-blue-100">You are on a 5-day attendance streak! 🔥</p>
               </div>
            </div>
            
            <div className="w-full md:w-1/3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
               <div className="flex justify-between text-sm font-medium mb-2">
                 <span>XP Progress</span>
                 <span>{user.xp} / {nextLevelXp} XP</span>
               </div>
               <div className="w-full bg-black/20 rounded-full h-3">
                 <div 
                  className="bg-yellow-400 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                 ></div>
               </div>
               <p className="text-xs mt-2 text-blue-100 text-right">Next Reward: Flexible Friday 🎉</p>
            </div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="My Attendance" value="98%" subtitle="This Month" icon={Clock} color="#3b82f6" />
        <StatCard title="Leave Balance" value="12 Days" subtitle="Remaining" icon={CalendarCheck} color="#10b981" />
        <StatCard title="Next Salary" value="Oct 30" subtitle="Estimated" icon={Banknote} color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
           <h3 className="font-bold text-gray-800 mb-4 flex items-center"><Trophy className="text-yellow-500 mr-2" size={20}/> Recent Achievements</h3>
           <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                 <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600 mr-4"><Star size={20} /></div>
                 <div>
                   <h4 className="font-medium text-gray-800">Early Bird</h4>
                   <p className="text-xs text-gray-500">Checked in before 9 AM for 7 days</p>
                 </div>
                 <span className="ml-auto text-sm font-bold text-blue-600">+50 XP</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                 <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-4"><TrendingUp size={20} /></div>
                 <div>
                   <h4 className="font-medium text-gray-800">Task Master</h4>
                   <p className="text-xs text-gray-500">Completed monthly goals</p>
                 </div>
                 <span className="ml-auto text-sm font-bold text-blue-600">+100 XP</span>
              </div>
           </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white flex flex-col justify-center items-center text-center shadow-lg">
            <div className="bg-white/10 p-4 rounded-full mb-4">
              <Star className="text-yellow-300 w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-2">Have HR Questions?</h3>
            <p className="text-indigo-200 text-sm mb-6">Our AI Assistant can help you with leave policies, salary queries, and more instantly.</p>
            <a href="#/assistant" className="px-6 py-2 bg-white text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition shadow-lg">Chat with Assistant</a>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      {user.role === UserRole.ADMIN ? <AdminDashboard /> : <EmployeeDashboard user={user} />}
    </div>
  );
};

export default Dashboard;
