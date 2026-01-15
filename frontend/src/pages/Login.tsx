import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import BackgroundScene from '../components/3d/BackgroundScene';
import { Lock, Mail, Loader } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(email, password);

        if (result.success) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            if (userInfo.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/faculty');
            }
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <>
            <BackgroundScene />
            <div className="flex justify-center items-center h-[80vh] relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel p-8 rounded-2xl w-full max-w-md"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center text-neon-blue">ACCESS PORTAL</h2>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Email Identity</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-purple" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-blue transition-colors text-white placeholder-gray-600"
                                    placeholder="name@university.edu"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Secure Key</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-purple" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-neon-blue transition-colors text-white placeholder-gray-600"
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(34, 211, 238, 0.6)" }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className="group relative w-full bg-cyan-400 text-black font-bold py-4 rounded-lg overflow-hidden transition-all hover:bg-cyan-300 flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative flex items-center gap-2 z-10 text-lg tracking-wide">
                                {isLoading ? <Loader className="animate-spin text-black" size={20} /> : 'INITIALIZE SESSION'}
                            </span>
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center bg-white/5 mx-auto rounded-lg py-3 w-4/5 border border-white/5">
                        <span className="text-gray-400 text-sm">New Faculty Member? </span>
                        <Link to="/register" className="text-neon-blue hover:text-white font-bold text-sm tracking-wide transition-colors ml-2">
                            CREATE IDENTITY
                        </Link>
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-500 font-mono tracking-widest opacity-50">
                        SECURE CONNECTION • 256-BIT ENCRYPTION
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default Login;
