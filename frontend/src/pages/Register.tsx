import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowRight, User, Mail, Lock, Shield, Building } from 'lucide-react';
import TiltCard from '../components/ui/TiltCard';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'lecturer', // Default role
        department: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    department: formData.department
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // On success, redirect to login
            navigate('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0"></div>

            {/* Particles/Background elements could be here or reused from BackgroundScene if made global */}

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <TiltCard className="backdrop-blur-xl bg-black/40 border border-white/10 p-8 rounded-2xl shadow-2xl shadow-neon-blue/20">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mb-4 border border-neon-blue/50">
                            <UserPlus className="text-neon-blue" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Access Request</h2>
                        <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Create New Identity</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                                    placeholder="John Doe"
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1 uppercase tracking-wider">Academic Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                                    placeholder="name@university.edu"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1 uppercase tracking-wider">Role</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all appearance-none"
                                >
                                    <option value="lecturer" className="bg-slate-900 text-white">Lecturer</option>
                                    <option value="hod" className="bg-slate-900 text-white">Head of Department</option>
                                    <option value="admin" className="bg-slate-900 text-white">Administrator</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1 uppercase tracking-wider">Department</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="department"
                                    required
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                                    placeholder="Computer Science"
                                    autoComplete="organization"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-3 group mt-6 text-lg tracking-wide"
                        >
                            {loading ? 'PROCESSING...' : (
                                <>
                                    INITIALIZE IDENTITY <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-400">
                        Please proceed to <Link to="/login" className="text-neon-blue hover:underline">Authorization Portal</Link> if you verified.
                    </div>
                </TiltCard>
            </motion.div>
        </div>
    );
};

export default Register;
