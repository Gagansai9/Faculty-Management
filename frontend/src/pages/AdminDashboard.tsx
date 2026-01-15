
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, XCircle, Plus, Activity, Server } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TiltCard from '../components/ui/TiltCard';
import AnalyticsCard from '../components/ui/AnalyticsCard';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [leaves, setLeaves] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [showTaskModal, setShowTaskModal] = useState(false);

    // UI Notification State
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Delete Confirmation State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    // Refs for scroll navigation
    const leavesSectionRef = useRef<HTMLDivElement>(null);
    const tasksSectionRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', deadline: '' });

    // --- RESUME COMPLIANCE: ADD USER & REPORT ---
    const [showUserModal, setShowUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: 'password123', role: 'faculty', department: 'CS', designation: 'Lecturer' });

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/users', newUser, { headers: { Authorization: `Bearer ${user.token}` } });
            setShowUserModal(false);
            setNewUser({ name: '', email: '', password: 'password123', role: 'faculty', department: 'CS', designation: 'Lecturer' });
            fetchData();
            showNotification("User created successfully node!");
        } catch (error) {
            console.error("Error creating user:", error);
            showNotification("Failed to create user.", 'error');
        }
    };

    const handleDownloadReport = async () => {
        try {
            const response = await axios.post('/api/admin/reports', {}, {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'system_report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading report:", error);
        }
    };
    // --------------------------------------------

    // Mock data for the chart
    const workloadData = [35, 60, 45, 75, 50, 80, 65];

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const usersRes = await axios.get('/api/admin/users', config);
            const leavesRes = await axios.get('/api/admin/leaves', config);
            const tasksRes = await axios.get('/api/tasks', config);

            setUsers(usersRes.data);
            setLeaves(leavesRes.data);
            setTasks(tasksRes.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.token]);

    const handleLeaveAction = async (id: string, status: string) => {
        try {
            await axios.put(`/api/admin/leaves/${id}`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchData();
        } catch (error) {
            console.error("Error updating leave:", error);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/tasks', newTask, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setShowTaskModal(false);
            setNewTask({ title: '', description: '', assignedTo: '', deadline: '' });
            // Immediate state update for responsive UI
            setTasks(prev => [...prev, res.data]);
            // Also fetch to ensure full sync
            fetchData();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleDeleteUser = (user: any) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await axios.delete(`/api/admin/users/${userToDelete.id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setShowDeleteModal(false);
            setUserToDelete(null);
            fetchData();
            showNotification("User deleted successfully.");
        } catch (error) {
            console.error("Error deleting user:", error);
            showNotification("Failed to delete user.", 'error');
        }
    };



    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const handleEditClick = (user: any) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/admin/users/${editingUser.id}`, editingUser, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setShowEditModal(false);
            setEditingUser(null);
            fetchData();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleApproveUser = async (targetUser: any) => {
        try {
            await axios.put(`/api/admin/users/${targetUser.id}/approve`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchData();
            showNotification("User approved!", 'success');
        } catch (error) {
            console.error("Error approving user:", error);
            showNotification("Failed to approve user.", 'error');
        }
    };

    const handleDisapproveUser = async (targetUser: any) => {
        try {
            await axios.put(`/api/admin/users/${targetUser.id}/disapprove`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchData();
            showNotification("User suspended.", 'success');
        } catch (error) {
            console.error("Error disapproving user:", error);
            showNotification("Failed to suspend user.", 'error');
        }
    };

    return (

        <div className="space-y-8 pb-20 pt-10 relative px-4 md:px-8">
            {/* Notification Toast */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-xl border font-bold shadow-2xl backdrop-blur-md ${notification.type === 'success' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}
                >
                    {notification.message}
                </motion.div>
            )}

            <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
                        COMMAND CENTER
                    </h1>
                    <p className="text-neon-blue font-mono text-xs md:text-sm tracking-widest mt-1">
                        SYSTEM ADMINISTRATOR: {user?.name?.toUpperCase()}
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-[13px] w-full md:w-auto">
                    <button
                        onClick={handleDownloadReport}
                        className="flex-1 md:flex-none bg-green-500/10 border border-green-500/50 text-green-500 px-[21px] py-[13px] rounded-xl hover:bg-green-500 hover:text-white transition-all font-bold flex items-center justify-center gap-2"
                    >
                        <FileText size={18} /> REPORT
                    </button>
                    <button
                        onClick={() => setShowUserModal(true)}
                        className="flex-1 md:flex-none bg-purple-500/10 border border-purple-500/50 text-purple-400 px-[21px] py-[13px] rounded-xl hover:bg-purple-500 hover:text-white transition-all font-bold flex items-center justify-center gap-2"
                    >
                        <Users size={18} /> ADD NODE
                    </button>
                    <button
                        onClick={() => setShowTaskModal(true)}
                        className="flex-1 md:flex-none bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 px-6 py-3 rounded-xl hover:bg-cyan-400 hover:text-black transition-all font-bold shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2"
                    >
                        <Plus size={18} /> INITIATE TASK PROTOCOL
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="flex-1 md:flex-none bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold shadow-[0_0_20px_rgba(255,0,0,0.1)] hover:shadow-[0_0_30px_rgba(255,0,0,0.4)]"
                    >
                        LOGOUT
                    </button>
                </div>
            </header >

            {/* Analytics Grid */}
            < div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" >
                <AnalyticsCard
                    title="Active Personnel"
                    value={users.length}
                    subtitle="Nodes Online"
                    icon={<Users size={24} />}
                    color="neon-blue"
                >
                    <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            className="h-full bg-neon-blue shadow-[0_0_10px_#00f3ff]"
                        />
                    </div>
                </AnalyticsCard>

                <AnalyticsCard
                    title="Pending Requests"
                    value={leaves.filter((l: any) => l.status === 'Pending').length}
                    subtitle="Awaiting Auth"
                    icon={<FileText size={24} />}
                    color="neon-purple"
                    onClick={() => scrollToSection(leavesSectionRef)}
                >
                    <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full ${i < leaves.filter((l: any) => l.status === 'Pending').length ? 'bg-neon-purple shadow-[0_0_5px_#bc13fe]' : 'bg-white/5'}`} />
                        ))}
                    </div>
                </AnalyticsCard>

                <AnalyticsCard
                    title="Task Velocity"
                    value={tasks.filter((t: any) => t.status === 'Completed').length}
                    subtitle="Completed Cycle"
                    icon={<CheckCircle size={24} />}
                    color="green-400"
                    onClick={() => scrollToSection(tasksSectionRef)}
                >
                    <div className="flex items-end gap-1 h-8 mt-2 opacity-50">
                        {workloadData.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.1 }}
                                className="flex-1 bg-green-400 rounded-t-sm"
                            />
                        ))}
                    </div>
                </AnalyticsCard>

                <AnalyticsCard
                    title="System Load"
                    value="Stable"
                    subtitle="Optimal"
                    icon={<Server size={24} />}
                    color="yellow-400"
                >
                    <div className="relative h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
                        <motion.div
                            animate={{ x: [-100, 200] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"
                        />
                    </div>
                </AnalyticsCard>
            </div >

            {/* Main Content Area */}
            < div className="grid grid-cols-1 lg:grid-cols-3 gap-8" >
                {/* 3D Visualization */}
                < TiltCard className="lg:col-span-1 glass-panel p-1 rounded-2xl h-[400px] relative overflow-hidden border border-white/5" >
                    <div className="absolute top-4 left-4 z-10 pointer-events-none">
                        <div className="flex items-center gap-2 text-neon-blue font-bold tracking-wider text-xs">
                            <Activity size={14} /> LIVE NETWORK TOPOLOGY
                        </div>
                    </div>
                    <Canvas className="w-full h-full">
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} color="#00f3ff" intensity={2} />
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
                        <mesh rotation={[0, 0, 0]}>
                            <sphereGeometry args={[1.8, 64, 64]} />
                            <meshStandardMaterial
                                color="#000000"
                                emissive="#00f3ff"
                                emissiveIntensity={0.2}
                                wireframe
                                wireframeLinewidth={2}
                            />
                        </mesh>
                        <mesh>
                            <sphereGeometry args={[1.0, 32, 32]} />
                            <meshStandardMaterial color="#bc13fe" opacity={0.3} transparent />
                        </mesh>
                    </Canvas>
                </TiltCard >

                {/* Task Management & Leaves Split */}
                < div className="lg:col-span-2 space-y-6" >
                    {/* Active Tasks Feed */}
                    < div ref={tasksSectionRef} className="glass-panel p-6 rounded-2xl border border-white/5 h-[400px] flex flex-col" >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold flex items-center gap-2 text-white">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> TARGET LIST
                            </h3>
                            <span className="text-xs text-gray-500 font-mono">SYNCED</span>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                            {tasks.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2">
                                    <CheckCircle size={40} className="opacity-20" />
                                    <p className="text-sm">ALL SYSTEMS CLEAR</p>
                                </div>
                            )}
                            {tasks.map((t: any) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={t.id}
                                    className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-neon-blue/30 p-4 rounded-xl transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-neon-blue transition-colors">{t.title}</h4>
                                            <p className="text-xs text-gray-400 mt-1">Assigned to: <span className="text-gray-300">{t.assignedUser?.name || 'Unknown'}</span></p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${t.status === 'Completed'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            {t.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
                                        <div
                                            className={`h-full ${t.status === 'Completed' ? 'bg-green-400' : 'bg-yellow-400'}`}
                                            style={{ width: t.status === 'Completed' ? '100%' : '40%' }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div >
                </div >
            </div >

            {/* Leave Requests - Compact Row */}
            < div ref={leavesSectionRef} className="glass-panel p-6 rounded-2xl border border-white/5" >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-neon-purple" /> AUTHORIZATION REQUESTS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leaves.filter((l: any) => l.status === 'Pending').length === 0 && (
                        <div className="col-span-full py-8 text-center text-gray-600 text-sm">No pending authorization requests.</div>
                    )}
                    {leaves.filter((l: any) => l.status === 'Pending').map((l: any) => (
                        <div key={l.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between h-full">
                            <div className="mb-4">
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-white">{l.user?.name || 'Unknown User'}</span>
                                    <span className="bg-neon-purple/20 text-neon-purple text-xs px-2 py-1 rounded border border-neon-purple/30 font-bold tracking-wider">PENDING</span>
                                </div>
                                <p className="text-gray-300 text-sm mt-2 font-medium">{l.reason}</p>
                                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-gray-400">
                                    <div>
                                        <span className="block text-gray-500 mb-0.5">FROM</span>
                                        <span className="text-white">{l.startDate ? new Date(l.startDate).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-gray-500 mb-0.5">TO</span>
                                        <span className="text-white">{l.endDate ? new Date(l.endDate).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button onClick={() => handleLeaveAction(l.id, 'Approved')} className="flex-1 bg-green-500/20 border border-green-500/30 text-green-400 py-1.5 rounded text-xs hover:bg-green-500/30 transition-colors font-bold">APPROVE</button>
                                <button onClick={() => handleLeaveAction(l.id, 'Rejected')} className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-1.5 rounded text-xs hover:bg-red-500/30 transition-colors font-bold">DENY</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div >

            {/* Task Modal */}
            {
                showTaskModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-panel p-8 rounded-2xl w-full max-w-md border border-neon-blue/30 box-shadow-neon"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-neon-blue">ASSIGN NEW TASK</h2>
                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:border-neon-blue outline-none"
                                        value={newTask.title}
                                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Description</label>
                                    <textarea
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:border-neon-blue outline-none h-24"
                                        value={newTask.description}
                                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Assign To</label>
                                    <select
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:border-neon-blue outline-none"
                                        value={newTask.assignedTo}
                                        onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                    >
                                        <option value="">Select Faculty</option>
                                        {users.filter(u => u.role === 'lecturer' || u.role === 'hod').map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Deadline</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:border-neon-blue outline-none"
                                        value={newTask.deadline}
                                        onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-black font-bold hover:shadow-[0_0_21px_rgba(0,243,255,0.6)] transition-all transform hover:scale-105">Assign Task</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
            }

            {/* Edit User Modal */}
            {
                showEditModal && editingUser && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-panel p-8 rounded-2xl w-full max-w-md border border-neon-blue/30 box-shadow-neon"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-neon-blue">MODIFY PROFILE</h2>
                            <form onSubmit={handleUpdateUser} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:border-neon-blue outline-none"
                                        value={editingUser.name}
                                        onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Department</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:border-neon-blue outline-none"
                                        value={editingUser.department}
                                        onChange={e => setEditingUser({ ...editingUser, department: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-black font-bold hover:shadow-[0_0_21px_rgba(188,19,254,0.6)] transition-all transform hover:scale-105">Update Profile</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
            }

            {/* User Management Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-panel rounded-2xl p-6"
            >
                <h3 className="text-xl font-bold mb-6">FACULTY DIRECTORY</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-sm">
                                <th className="py-3 px-4">NAME</th>
                                <th className="py-3 px-4">DEPARTMENT</th>
                                <th className="py-3 px-4">STATUS</th>
                                <th className="py-3 px-4">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u: any) => (
                                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 font-medium">{u.name}</td>
                                    <td className="py-3 px-4 text-gray-400">{u.department || 'N/A'}</td>
                                    <td className="py-3 px-4">
                                        {u.isApproved ? (
                                            <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">ACTIVE</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">PENDING</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 flex gap-4">
                                        {!u.isApproved ? (
                                            <>
                                                <button
                                                    onClick={() => handleApproveUser(u)}
                                                    className="text-green-400 hover:text-green-300 cursor-pointer hover:underline text-xs font-bold tracking-wider flex items-center gap-1"
                                                >
                                                    APPROVE
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u)}
                                                    className="text-red-500 hover:text-red-400 cursor-pointer hover:underline text-xs font-bold tracking-wider flex items-center gap-1"
                                                >
                                                    DECLINE
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleDisapproveUser(u)}
                                                className="text-yellow-400 hover:text-yellow-300 cursor-pointer hover:underline text-xs font-bold tracking-wider flex items-center gap-1"
                                            >
                                                SUSPEND
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEditClick(u)}
                                            className="text-cyan-400 hover:text-cyan-300 cursor-pointer hover:underline text-xs font-bold tracking-wider flex items-center gap-1"
                                        >
                                            EDIT
                                        </button>
                                        {u.isApproved && (
                                            <button
                                                onClick={() => handleDeleteUser(u)}
                                                className="text-red-500 hover:text-red-400 cursor-pointer hover:underline text-xs font-bold tracking-wider flex items-center gap-1"
                                            >
                                                DELETE
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
            {/* Delete Confirmation Modal */}
            {showDeleteModal && userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-900 border border-red-500/50 p-8 rounded-2xl w-full max-w-md shadow-[0_0_55px_rgba(255,0,0,0.2)]"
                    >
                        <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
                            <XCircle size={24} /> CONFIRM DELETION
                        </h2>
                        <p className="text-gray-300 mb-8">
                            Are you sure you want to remove user <strong>{userToDelete.name}</strong>? This action causes permanent data loss and cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }}
                                className="flex-1 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-bold text-gray-400"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={confirmDeleteUser}
                                className="flex-1 py-3 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all"
                            >
                                DELETE NODE
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Add User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-neon-purple p-[34px] rounded-2xl w-full max-w-[550px] shadow-[0_0_55px_rgba(188,19,254,0.2)]">
                        <h2 className="text-2xl font-bold text-neon-purple mb-[21px]">ADD NEW NODE</h2>
                        <form onSubmit={handleCreateUser} className="space-y-[21px]">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-purple focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email Identity</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-purple focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-[13px]">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-purple focus:outline-none"
                                    >
                                        <option value="lecturer">Lecturer</option>
                                        <option value="hod">Supervisor (HOD)</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Department</label>
                                    <input
                                        type="text"
                                        value={newUser.department}
                                        onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-purple focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-[13px] pt-[13px]">
                                <button
                                    type="button"
                                    onClick={() => setShowUserModal(false)}
                                    className="px-[21px] py-[13px] rounded-lg bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:text-white text-red-500 transition-colors font-bold"
                                >
                                    ABORT
                                </button>
                                <button
                                    type="submit"
                                    className="px-[21px] py-[13px] rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-black font-bold hover:shadow-[0_0_21px_rgba(188,19,254,0.6)] transition-all transform hover:scale-105"
                                >
                                    INITIALIZE
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
};

export default AdminDashboard;
