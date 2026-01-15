import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Plus, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare } from 'lucide-react';
import axios from 'axios';
import AIAssistant from '../components/ui/AIAssistant';
import DepartmentAnalytics from '../components/ui/DepartmentAnalytics';
import TaskProgressSlider from '../components/ui/TaskProgressSlider';

const FacultyDashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const [leaves, setLeaves] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]); // For HOD

    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [newLeave, setNewLeave] = useState({ reason: '', startDate: '', endDate: '' });

    // HOD Task Assignment State
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', deadline: '' });

    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const tasksRes = await axios.get('/api/tasks', config);
            const leavesRes = await axios.get('/api/faculty/leaves', config);

            setTasks(tasksRes.data);
            setLeaves(leavesRes.data);

            // If HOD, fetch all users
            if (user?.role === 'hod') {
                const usersRes = await axios.get('/api/faculty/all', config);
                setUsers(usersRes.data);
            }

        } catch (error) {
            console.error("Error fetching faculty data:", error);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const handleTaskUpdate = async (id: string, updates: any) => {
        try {
            await axios.put(`/api/tasks/${id}`, updates, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchData(); // Refresh to reflect status changes if progress hits 100/0
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Helper to get local date string YYYY-MM-DD
    const getTodayString = () => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
    };

    const handleRequestLeave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Date Validation
        const start = new Date(newLeave.startDate);
        const end = new Date(newLeave.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Allow starting "today" in local time
        const todayStr = getTodayString();

        if (newLeave.startDate < todayStr) {
            alert("Start date cannot be in the past.");
            return;
        }
        if (newLeave.endDate < newLeave.startDate) {
            alert("End date must be after start date.");
            return;
        }

        try {
            await axios.post('/api/faculty/leave', newLeave, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setShowLeaveModal(false);
            setNewLeave({ reason: '', startDate: '', endDate: '' });
            fetchData();
        } catch (error) {
            console.error("Error requesting leave:", error);
        }
    };

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault();

        // Date Validation
        const todayStr = getTodayString();

        if (newTask.deadline < todayStr) {
            alert("Deadline cannot be in the past.");
            return;
        }

        try {
            await axios.post('/api/tasks', newTask, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setShowTaskModal(false);
            setNewTask({ title: '', description: '', assignedTo: '', deadline: '' });
            fetchData();
        } catch (error) {
            console.error("Error assigning task:", error);
        }
    };

    const downloadReport = async (userId: string, userName: string) => {
        try {
            const response = await axios.get(`/api/faculty/reports/${userId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob', // Important for PDF
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Report_${userName.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading report:", error);
        }
    };

    return (
        <div className="space-y-8 pb-20 pt-10 relative px-4 md:px-8">
            <header className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-white">
                        FACULTY PORTAL
                    </h1>
                    <p className="text-gray-400 mt-1">Welcome back, {user?.name} {user?.role === 'hod' && <span className="text-neon-purple font-bold text-xs border border-neon-purple/50 px-2 rounded ml-2">HOD ACCESS</span>}</p>
                </div>
                <div className="flex items-center gap-4">
                    {user?.role === 'hod' && (
                        <button
                            onClick={() => setShowTaskModal(true)}
                            className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] font-bold tracking-wide"
                        >
                            <CheckSquare size={18} /> <span>ASSIGN TASK</span>
                        </button>
                    )}
                    <button
                        onClick={() => setShowLeaveModal(true)}
                        className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] font-bold tracking-wide"
                    >
                        <Plus size={18} /> <span>NEW REQUEST</span>
                    </button>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(255,0,0,0.1)] hover:shadow-[0_0_25px_rgba(255,0,0,0.3)] font-bold"
                    >
                        LOGOUT
                    </button>
                </div>
            </header>

            {/* HOD Analytics Section */}
            {user?.role === 'hod' && (
                <DepartmentAnalytics tasks={tasks} users={users} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card & Team List (HOD only) */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center space-y-4"
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 border-2 border-neon-blue p-1">
                            <div className="w-full h-full rounded-full bg-black/50 flex items-center justify-center">
                                <User size={40} className="text-gray-300" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{user?.name}</h2>
                            <p className="text-neon-blue text-sm">{user?.role?.toUpperCase()}</p>
                        </div>
                        <div className="w-full pt-4 border-t border-white/10 flex justify-between text-sm">
                            <span className="text-gray-400">Department</span>
                            <span>{user?.department || 'N/A'}</span>
                        </div>
                    </motion.div>

                    {user?.role === 'hod' && users.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-6 rounded-2xl"
                        >
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-neon-blue">
                                <User size={18} /> MY TEAM
                            </h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                                {users.map(u => (
                                    <div key={u.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 hover:border-neon-blue/30 transition-colors">
                                        <div>
                                            <p className="font-bold text-sm text-white">{u.name}</p>
                                            <p className="text-xs text-gray-400">{u.designation || 'Lecturer'}</p>
                                        </div>
                                        <button
                                            onClick={() => downloadReport(u.id, u.name)}
                                            className="text-gray-400 hover:text-neon-blue transition-colors p-2 hover:bg-white/5 rounded-full"
                                            title="Download Report"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Task List */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 glass-panel p-6 rounded-2xl"
                >
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <CheckSquare size={20} className="text-neon-blue" />
                        {user?.role === 'hod' ? 'DEPARTMENT TASKS (MONITORING)' : 'MY TASKS'}
                    </h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        {tasks.length === 0 && <div className="text-gray-500">No tasks assigned.</div>}
                        {tasks.map((task) => (
                            <motion.div
                                layout
                                key={task.id}
                                onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                                className={`bg-white/5 p-4 rounded-lg border border-white/5 flex flex-col gap-2 group hover:border-neon-blue/30 transition-all cursor-pointer ${expandedTaskId === task.id ? 'bg-white/10 border-neon-blue/50' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-white group-hover:text-neon-blue transition-colors text-lg">{task.title}</h4>
                                            {user?.role === 'hod' && (
                                                <span className="text-xs text-gray-500 bg-black/30 px-2 py-0.5 rounded border border-white/5">
                                                    To: {task.assignedUser?.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">Due: {task.deadline} • By: {task.assignedBy?.name || user?.name}</div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded border whitespace-nowrap ml-2 ${task.status === 'Completed' ? 'bg-green-500/20 border-green-500/30 text-green-400' : task.status === 'In Progress' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'}`}>
                                        {task.status}
                                    </span>
                                </div>

                                {/* Progress Slider - Always Visible or just on expand? Let's keep it visible for quick status check */}
                                <div onClick={(e) => e.stopPropagation()}>
                                    <TaskProgressSlider
                                        progress={task.progress || 0}
                                        readOnly={user?.role === 'hod' || task.status === 'Completed'} // HOD view only, or read-only if completed
                                        onChange={(newVal) => handleTaskUpdate(task.id, { progress: newVal })}
                                    />
                                </div>

                                <motion.div
                                    initial={false}
                                    animate={{ height: expandedTaskId === task.id ? 'auto' : 0, opacity: expandedTaskId === task.id ? 1 : 0 }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-sm text-gray-300 pt-2 border-t border-white/10 mt-2">{task.description}</p>

                                    {task.status !== 'Completed' && user?.role !== 'hod' && (
                                        <div className="flex justify-end mt-3 gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTaskUpdate(task.id, { status: 'In Progress', progress: 50 }); // Quick set to 50%
                                                }}
                                                className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded hover:bg-blue-400 hover:text-black transition-colors font-bold border border-blue-500/30"
                                            >
                                                Start Working
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTaskUpdate(task.id, { status: 'Completed', progress: 100 });
                                                }}
                                                className="text-xs bg-green-500/20 text-green-400 px-3 py-1.5 rounded hover:bg-green-400 hover:text-black transition-colors font-bold border border-green-500/30"
                                            >
                                                Mark Done
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-6 rounded-2xl"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="text-neon-purple" />
                    <h3 className="font-bold">LEAVE HISTORY</h3>
                </div>
                {leaves.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">No leave history found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {leaves.map((leave) => (
                            <div key={leave.id} className="bg-white/5 p-4 rounded-lg border border-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm">{leave.reason}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${leave.status === 'Approved' ? 'text-green-400 bg-green-500/10' : leave.status === 'Rejected' ? 'text-red-400 bg-red-500/10' : 'text-yellow-400 bg-yellow-500/10'}`}>{leave.status}</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </div>
                                {leave.adminComment && (
                                    <div className="mt-2 text-xs text-gray-500 border-t border-white/5 pt-2">
                                        Admin: {leave.adminComment}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Leave Request Modal */}
            {showLeaveModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel p-8 rounded-2xl w-full max-w-md border border-neon-purple/30 box-shadow-neon-purple"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-neon-purple">SUBMIT REQUEST</h2>
                        <form onSubmit={handleRequestLeave} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Reason</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:border-neon-purple outline-none transition-colors"
                                    placeholder="e.g. Medical Leave, Conference"
                                    value={newLeave.reason}
                                    onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="block text-gray-400 text-sm mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:border-neon-purple outline-none transition-colors"
                                        value={newLeave.startDate}
                                        min={getTodayString()}
                                        onChange={e => setNewLeave({ ...newLeave, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-gray-400 text-sm mb-1">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:border-neon-purple outline-none transition-colors"
                                        value={newLeave.endDate}
                                        min={newLeave.startDate || getTodayString()}
                                        onChange={e => setNewLeave({ ...newLeave, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button type="button" onClick={() => setShowLeaveModal(false)} className="flex-1 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform hover:scale-105">Submit Request</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* HOD Assign Task Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel p-8 rounded-2xl w-full max-w-md border border-neon-blue/30 box-shadow-neon"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-neon-blue">ASSIGN TASK (HOD)</h2>
                        <form onSubmit={handleAssignTask} className="space-y-4">
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
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:border-neon-blue outline-none p-2"
                                    value={newTask.assignedTo}
                                    onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                >
                                    <option value="" className="bg-black text-white">Select Faculty</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id} className="bg-black text-white">{u.name} ({u.department})</option>
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
                                    min={getTodayString()}
                                    onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-white transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-black font-bold hover:shadow-[0_0_21px_rgba(0,243,255,0.6)] transition-all transform hover:scale-105">Assign Task</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <AIAssistant userData={user} tasks={tasks} leaves={leaves} />
        </div>
    );
};

export default FacultyDashboard;
