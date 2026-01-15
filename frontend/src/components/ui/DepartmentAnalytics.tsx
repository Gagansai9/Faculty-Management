import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DepartmentAnalyticsProps {
    tasks: any[];
    users: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const STATUS_COLORS = {
    'Pending': '#FFBB28',
    'In Progress': '#0088FE',
    'Completed': '#00C49F'
};

const DepartmentAnalytics: React.FC<DepartmentAnalyticsProps> = ({ tasks, users }) => {
    // 1. Task Status Distribution
    const statusData = [
        { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length },
        { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
        { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length },
    ].filter(d => d.value > 0);

    // 2. Faculty Workload (Tasks per User)
    const workloadData = users.map(user => {
        const userTasks = tasks.filter(t => t.assignedToId === user.id);
        const completed = userTasks.filter(t => t.status === 'Completed').length;
        return {
            name: user.name.split(' ')[0], // First name for brevity
            total: userTasks.length,
            completed: completed,
            pending: userTasks.length - completed
        };
    }).filter(d => d.total > 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 rounded-2xl"
            >
                <h3 className="text-lg font-bold mb-4 text-neon-blue">Task Status Distribution</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
                    {statusData.map(entry => (
                        <div key={entry.name} className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] }}></div>
                            <span>{entry.name} ({entry.value})</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-6 rounded-2xl"
            >
                <h3 className="text-lg font-bold mb-4 text-neon-purple">Faculty Workload</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={workloadData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                            />
                            <Bar dataKey="completed" stackId="a" fill="#00C49F" name="Completed" />
                            <Bar dataKey="pending" stackId="a" fill="#FFBB28" name="Pending" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default DepartmentAnalytics;
