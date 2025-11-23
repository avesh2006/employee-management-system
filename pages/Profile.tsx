import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Briefcase, Calendar, Save, Camera } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUserProfile, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    age: '',
    avatarUrl: ''
  });
  
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        department: user.department || '',
        age: user.age ? user.age.toString() : '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (!formData.name || !formData.department) {
        setMessage({ type: 'error', text: 'Name and Department are required.' });
        return;
    }

    const success = await updateUserProfile({
        name: formData.name,
        department: formData.department,
        age: formData.age ? parseInt(formData.age) : undefined,
        avatarUrl: formData.avatarUrl
    });

    if (success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } else {
        setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Profile Card Preview */}
           <div className="md:col-span-1">
               <div className="bg-white rounded-xl shadow-md overflow-hidden">
                   <div className="h-24 bg-gradient-to-r from-blue-500 to-teal-400"></div>
                   <div className="px-6 pb-6 text-center relative">
                       <div className="w-24 h-24 mx-auto -mt-12 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                           <img 
                                src={formData.avatarUrl || user.avatarUrl || "https://ui-avatars.com/api/?name=User"} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=User")}
                           />
                       </div>
                       <h3 className="font-bold text-xl text-gray-800 mt-3">{formData.name || user.name}</h3>
                       <p className="text-gray-500 text-sm">{formData.department || user.department}</p>
                       
                       <div className="mt-4 flex justify-center space-x-2">
                           <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full capitalize">
                               {user.role}
                           </span>
                           {formData.age && (
                               <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                                   {formData.age} Years Old
                               </span>
                           )}
                       </div>
                   </div>
               </div>
           </div>

           {/* Edit Form */}
           <div className="md:col-span-2">
               <div className="bg-white rounded-xl shadow-md p-6">
                   <h3 className="font-bold text-gray-800 mb-6 border-b border-gray-100 pb-2">Personal Information</h3>
                   
                   {message && (
                       <div className={`p-3 mb-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           {message.text}
                       </div>
                   )}

                   <form onSubmit={handleSubmit} className="space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                               <div className="relative">
                                   <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                   <input 
                                       type="text" 
                                       value={formData.name}
                                       onChange={e => setFormData({...formData, name: e.target.value})}
                                       className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                   />
                               </div>
                           </div>
                           
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                               <div className="relative">
                                   <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                   <input 
                                       type="number" 
                                       value={formData.age}
                                       onChange={e => setFormData({...formData, age: e.target.value})}
                                       className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                       placeholder="Years"
                                   />
                               </div>
                           </div>
                       </div>

                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Branch / Department</label>
                           <div className="relative">
                               <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                               <select 
                                   value={formData.department}
                                   onChange={e => setFormData({...formData, department: e.target.value})}
                                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                               >
                                   <option value="Engineering">Engineering</option>
                                   <option value="Operations">Operations</option>
                                   <option value="Human Resources">Human Resources</option>
                                   <option value="Marketing">Marketing</option>
                                   <option value="Finance">Finance</option>
                                   <option value="Support">Support</option>
                                   <option value="New Hire">New Hire</option>
                               </select>
                           </div>
                       </div>

                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                           <div className="relative">
                               <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                               <input 
                                   type="email" 
                                   value={user.email}
                                   disabled
                                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                               />
                           </div>
                           <p className="text-xs text-gray-400 mt-1">Email cannot be changed directly.</p>
                       </div>

                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                           <div className="relative">
                               <Camera className="absolute left-3 top-3 text-gray-400" size={18} />
                               <input 
                                   type="text" 
                                   value={formData.avatarUrl}
                                   onChange={e => setFormData({...formData, avatarUrl: e.target.value})}
                                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                   placeholder="https://example.com/avatar.jpg"
                               />
                           </div>
                       </div>

                       <div className="pt-4">
                           <button 
                               type="submit" 
                               disabled={loading}
                               className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition flex items-center disabled:opacity-50"
                           >
                               {loading ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Changes</>}
                           </button>
                       </div>
                   </form>
               </div>
           </div>
       </div>
    </div>
  );
};

export default Profile;