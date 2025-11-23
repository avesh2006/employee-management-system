import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldCheck, Mail, Lock, User, Briefcase, ChevronRight } from 'lucide-react';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('john@ems.com');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isRegistering) {
      const success = await register({ email, name, role, department: 'New Hire' });
      if (success) {
        // Register handles the "login" state setting automatically in AuthContext for this demo
        navigate('/dashboard');
      }
    } else {
      // Login Flow
      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));
      // Use the selected role from the form to authenticate as that role
      login(email, role);
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md z-10 border border-white/50 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 text-white mb-4 shadow-lg">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {isRegistering ? 'Join EMS' : 'Employee System'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isRegistering ? 'Create your employee account' : 'Sign in to access your dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
             <div className="relative group">
                <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegistering}
                />
             </div>
          )}
          
          <div className="relative group">
            <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
             <Briefcase className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition" size={20} />
             <select
               className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none text-gray-600"
               value={role}
               onChange={(e) => setRole(e.target.value as UserRole)}
             >
                <option value={UserRole.EMPLOYEE}>Employee</option>
                <option value={UserRole.ADMIN}>Admin</option>
             </select>
             <div className="absolute right-3 top-3 pointer-events-none">
                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
             </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold rounded-lg shadow-md transform transition active:scale-95 flex items-center justify-center"
          >
            {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
                <>
                    {isRegistering ? 'Create Account' : 'Sign In'} <ChevronRight size={18} className="ml-1" />
                </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
            <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="ml-2 text-blue-600 font-bold hover:underline"
            >
                {isRegistering ? "Login" : "Register"}
            </button>
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
            Default Credentials:<br/> Admin: admin@ems.com | User: john@ems.com
        </div>
      </div>
    </div>
  );
};

export default Login;